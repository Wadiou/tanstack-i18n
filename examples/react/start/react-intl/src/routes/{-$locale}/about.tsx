import { createFileRoute } from "@tanstack/react-router";
import { useIntl } from "react-intl";
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
  const intl = useIntl();

  return (
    <div className="layout">
      <Header />
      <h1>{intl.formatMessage({ id: "Common.aboutTitle" })}</h1>
      <p>{intl.formatMessage({ id: "Common.aboutBody" })}</p>
    </div>
  );
}
