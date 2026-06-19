import { createFileRoute } from "@tanstack/solid-router";
import { Header } from "@/components/header";
import { t } from "@/i18n/t";
import { hero } from "@/paraglide/messages";

export const Route = createFileRoute("/{-$locale}/")({
  component: HomePage,
});

function HomePage() {
  const t_hero = t(hero);
  return (
    <div class="layout">
      <Header />
      <h1 class="hero">{t_hero()}</h1>
    </div>
  );
}
