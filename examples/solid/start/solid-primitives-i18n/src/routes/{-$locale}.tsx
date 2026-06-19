import { createFileRoute, notFound, Outlet } from "@tanstack/solid-router";
import { isValidLocale } from "@/constants/locales";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (params.locale && !isValidLocale(params.locale)) {
      throw notFound();
    }
  },
  component: () => <Outlet />,
});
