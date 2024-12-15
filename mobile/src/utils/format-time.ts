export function formatTime(t: Date) {
  return (
    ("0" + t.getHours()).slice(-2) + ":" + ("0" + t.getMinutes()).slice(-2)
  );
}
