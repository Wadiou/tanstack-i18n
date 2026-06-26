import {
  createNavigation,
  createToLocalizedRoute,
} from "@wadiou/tanstack-i18n/react-router";
import { config } from "@/locale-config";
import type { FileRouteTypes } from "@/routeTree.gen";

export const toLocalizedRoute =
  createToLocalizedRoute<FileRouteTypes["to"]>(config);

export const { LocalizedLink, useLocalizedNavigate, localizedRedirect } =
  createNavigation<FileRouteTypes["to"]>({ toLocalizedRoute });
