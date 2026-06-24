import { createFileRoute } from "@tanstack/react-router";
import { useTranslations } from "use-intl";
import { Header } from "@/components/header";

import { localizedRedirect } from "@/i18n/routes";

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
    <div className="layout">
      <Header />
      <h1>{t("about.title")}</h1>
      <p>{t("about.body")}</p>
    </div>
  );
}
