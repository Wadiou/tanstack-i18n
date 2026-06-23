import { createFileRoute } from "@tanstack/react-router";
import { useIntl } from "react-intl";
import { Header } from "@/components/header";

export const Route = createFileRoute("/{-$locale}/")({
  component: HomePage,
});

function HomePage() {
  const intl = useIntl();

  return (
    <div className="layout">
      <Header />
      <h1 className="hero">{intl.formatMessage({ id: "Landing.hero" })}</h1>
    </div>
  );
}
