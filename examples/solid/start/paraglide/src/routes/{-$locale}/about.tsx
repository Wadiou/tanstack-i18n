import { createFileRoute } from "@tanstack/solid-router";
import { Header } from "@/components/header";
import { localizedRedirect } from "@/i18n/routes";
import { t } from "@/i18n/t";
import { aboutDescription, aboutTitle } from "@/paraglide/messages";

export const Route = createFileRoute("/{-$locale}/about")({
  beforeLoad: () => {
    const isAuthorized = true; // Simulated state
    if (!isAuthorized) {
      throw localizedRedirect({
        to: "/",
      });
    }
  },
  component: AboutPage,
});

function AboutPage() {
  const t_aboutTitle = t(aboutTitle);
  const t_aboutDescription = t(aboutDescription);
  return (
    <div class="layout">
      <Header />
      <h1>{t_aboutTitle()}</h1>
      <p>{t_aboutDescription()}</p>
    </div>
  );
}
