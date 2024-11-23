// sudo chmod a+rw /dev/ttyUSB0

#include <SoftwareSerial.h>
#include <pt.h>
#include <DHT.h>
#include <HX710B.h>
#include <LiquidCrystal_I2C.h>

#define PIN_B_TXD 2
#define PIN_B_RXD 3
#define PIN_T_DAT 4
#define PIN_P_OUT 5
#define PIN_P_SCK 6

SoftwareSerial serial_b(PIN_B_TXD, PIN_B_RXD);
DHT senz_th(PIN_T_DAT, DHT11);
HX710B senz_p;
LiquidCrystal_I2C lcd(0x27, 16, 2);

byte CharDegree[8] = {
  0b00010,
  0b00101,
  0b00010,
  0b00000,
  0b00000,
  0b00000,
  0b00000,
  0b00000
};

struct SenzorsValue {
  float humidity;
  float temperature;
  float pressure;
};

SenzorsValue currentValue;




// FUNCTIONS


// Utils

// String split_start(String str, String spl) {
//   int i = str.indexOf(spl);
//   if (i < 0) return str;
//   return str.substring(0, i);
// }

// String split_rest(String str, String spl) {
//   int i = str.indexOf(spl);
//   if (i < 0) return "";
//   return str.substring(i + 1);
// }


// Senzors

SenzorsValue senzors_getValue() {
  Serial.println("Reading current values from senzors"); 

  float humi = senz_th.readHumidity();
  float temp = senz_th.readTemperature();
  float pres = senz_p.pascal() + 101325;

  return { humi, temp, pres };
}

String senzors_stringifyValue(SenzorsValue val) {
  return String(val.humidity) + ":" + String(val.temperature) + ":" + String(val.pressure);
}


// Display

int display_getStartIndex(int length) {
  return (16 - length) / 2;
}

int displayCurrentScreen = 0;
void display_drawValue(SenzorsValue val) {
  int displayScreenCount = 3;

  lcd.clear();

  if (displayCurrentScreen == 0) {
    String title = "Vlhkost";
    lcd.setCursor(display_getStartIndex(title.length()), 0);
    lcd.print(title);

    String out = String(val.humidity, 0) + " %";
    lcd.setCursor(display_getStartIndex(out.length()), 1);
    lcd.print(out);
  } else if (displayCurrentScreen == 1) {
    String title = "Teplota";
    lcd.setCursor(display_getStartIndex(title.length()), 0);
    lcd.print(title);

    String out = String(val.temperature, 1);
    out.replace(".", ",");
    lcd.setCursor(display_getStartIndex(out.length() + 2), 1);
    lcd.print(out);
    lcd.write(0);
    lcd.print("C");
  } else if (displayCurrentScreen == 2) {
    String title = "Tlak";
    lcd.setCursor(display_getStartIndex(title.length()), 0);
    lcd.print(title);

    String out = String(val.pressure / 100, 1) + " hPa";
    out.replace(".", ",");
    lcd.setCursor(display_getStartIndex(out.length()), 1);
    lcd.print(out);
  }

  displayCurrentScreen++;
  if (displayCurrentScreen >= displayScreenCount) {
    displayCurrentScreen = 0;
  }
}


// Bluetooth

// void bt_commandPing() {
//   serial_b.print("pong;");
// }

void bt_commandData() {
  serial_b.print("$data:" + senzors_stringifyValue(currentValue) + ":data;");
}

// void bt_handleCommandInput(String input) {
//   Serial.print("BT command: ");
//   Serial.println(input);
//   String command = split_start(input, " ");

//   if (command == "ping") {
//     bt_commandPing();
//   } else if (command == "data") {
//     bt_commandData();
//   }
// }

// void bt_readInput() {
//   String data = "";
//   while (serial_b.available() > 0) {
//     char c = serial_b.read();
//     data += c;
//   }

//   String part = "";
//   int index = -1;
//   while ((index = data.indexOf(";")) > 0) {
//     part = data.substring(0, index);
//     data = data.substring(index + 1);
//     bt_handleCommandInput(part);
//   }
// }



// PROGRAM

static struct pt pt_display, pt_senzor, pt_bluetooth;

static int protothread_display(struct pt *pt, int interval) {
  static unsigned long timestamp = 0;
  PT_BEGIN(pt);
  while(1) {
    PT_WAIT_UNTIL(pt, millis() - timestamp > interval);
    timestamp = millis();
    display_drawValue(currentValue);
  }
  PT_END(pt);
}

static int protothread_senzor(struct pt *pt, int interval) {
  static unsigned long timestamp = 0;
  PT_BEGIN(pt);
  while(1) {
    PT_WAIT_UNTIL(pt, millis() - timestamp > interval);
    timestamp = millis();
    currentValue = senzors_getValue();
  }
  PT_END(pt);
}

static int protothread_bluetooth(struct pt *pt, int interval) {
  static unsigned long timestamp = 0;
  PT_BEGIN(pt);
  while(1) {
    PT_WAIT_UNTIL(pt, millis() - timestamp > interval);
    timestamp = millis();
    bt_commandData();
  }
  PT_END(pt);
}

void setup() {
  senz_th.begin();
  senz_p.begin(PIN_P_OUT, PIN_P_SCK, 128);

  lcd.init();
  lcd.clear();
  lcd.backlight();

  lcd.createChar(0, CharDegree);

  Serial.begin(9600);
  serial_b.begin(9600);

  serial_b.println("AT+NAMEVPinMeteo");

  PT_INIT(&pt_display);
  PT_INIT(&pt_senzor);
  PT_INIT(&pt_bluetooth);

  currentValue = senzors_getValue();
}

void loop() {
  protothread_display(&pt_display, 3000);
  protothread_senzor(&pt_senzor, 10000);
  protothread_bluetooth(&pt_bluetooth, 1000);
}
