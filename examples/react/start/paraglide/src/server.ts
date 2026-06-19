import handler from "@tanstack/react-start/server-entry";
import { locale } from "./locale";

export default {
  fetch: locale.createServerEntry((request) => handler.fetch(request)),
};
