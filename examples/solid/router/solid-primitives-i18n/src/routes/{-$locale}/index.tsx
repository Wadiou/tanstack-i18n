import { createFileRoute } from "@tanstack/solid-router";
import { Header } from "@/components/header";
import { useTranslations } from "@/i18n/use-translations";

export const Route = createFileRoute("/{-$locale}/")({
  component: HomePage,
});

function HomePage() {
  const t = useTranslations("Landing");
  return (
    <div class="layout">
      <Header />
      <h1 class="hero">{t("hero")}</h1>
    </div>
  );
}
