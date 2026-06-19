import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { hero } from "@/paraglide/messages";

export const Route = createFileRoute("/{-$locale}/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="layout">
      <Header />
      <h1 className="hero">{hero()}</h1>
    </div>
  );
}
