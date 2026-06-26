import handler from "@tanstack/solid-start/server-entry";
import { locale } from "./locale";

export default {
  fetch: locale.createServerEntry((request: Request) => handler.fetch(request)),
};
