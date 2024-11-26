import { Database } from "lucide-react-native";
import React, { ReactNode } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMigrations } from "../db/migrations";
import { Banner, BannerContent, BannerHeader } from "./banner";

export default function MigrationsLoader({
  children,
}: {
  children?: ReactNode;
}) {
  const { error, success } = useMigrations();

  if (error) {
    return (
      <SafeAreaView className="flex-1 flex-col items-stretch justify-center">
        <Banner variant="error" className="mx-6">
          <BannerHeader icon={Database} title="Chyba migrace" />
          <BannerContent>
            <Text>{error.message}</Text>
            <Text>Zkuste aplikaci restartovat.</Text>
          </BannerContent>
        </Banner>
      </SafeAreaView>
    );
  }

  if (!success) {
    return (
      <SafeAreaView className="flex-1 flex-row items-center justify-center gap-1">
        <ActivityIndicator />
        <Text>Příprava databáze...</Text>
      </SafeAreaView>
    );
  }

  return children;
}
