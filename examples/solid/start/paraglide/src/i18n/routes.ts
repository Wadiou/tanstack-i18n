import {
  createNavigation,
  createToLocalizedRoute,
} from "@Wadiou/tanstack-i18n/solid-router";
import { config } from "@/locale-config";
import type { FileRouteTypes } from "@/routeTree.gen";

export const toLocalizedRoute =
  createToLocalizedRoute<FileRouteTypes["to"]>(config);

export const { LocalizedLink, useLocalizedNavigate, localizedRedirect } =
  createNavigation<FileRouteTypes["to"]>({ toLocalizedRoute });
