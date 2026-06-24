import { createFileRoute } from "@tanstack/solid-router";
import { Header } from "@/components/header";
import { localizedRedirect } from "@/i18n/routes";
import { useTranslations } from "@/i18n/use-translations";

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
  const t = useTranslations("Common");
  return (
    <div class="layout">
      <Header />
      <h1>{t("about.title")}</h1>
      <p>{t("about.body")}</p>
    </div>
  );
}
