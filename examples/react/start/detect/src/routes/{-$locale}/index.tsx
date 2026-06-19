import { createFileRoute } from "@tanstack/react-router";
import { useTranslations } from "use-intl";
import { Header } from "@/components/header";

export const Route = createFileRoute("/{-$locale}/")({
  component: HomePage,
});

function HomePage() {
  const t = useTranslations("Landing");

  return (
    <div className="layout">
      <Header />
      <h1 className="hero">{t("hero")}</h1>
    </div>
  );
}
