import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/header";

export const Route = createFileRoute("/{-$locale}/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation("landing");

  return (
    <div className="layout">
      <Header />
      <h1 className="hero">{t("hero")}</h1>
    </div>
  );
}
