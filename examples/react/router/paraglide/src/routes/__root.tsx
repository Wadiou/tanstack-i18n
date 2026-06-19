import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import {
	isValidLocale,
	LOCALE_TEXT_DIRECTION,
	type SupportedLocale,
} from "@/constants/locales";
import { LocaleProvider } from "@/i18n/provider";
import { getLocale } from "@/locale";
import { setLocale } from "@/paraglide/runtime";

const EXAMPLE_NAME = "react-router-paraglide";

export interface RouterContext {
	locale: SupportedLocale;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async () => {
		const active = await getLocale();
		if (!isValidLocale(active)) {
			throw new Error(`Unsupported locale: ${active}`);
		}
		setLocale(active);
		document.documentElement.setAttribute("lang", active);
		document.documentElement.setAttribute("dir", LOCALE_TEXT_DIRECTION[active]);
		return { locale: active };
	},
	component: RootComponent,
});

function RootComponent() {
	return (
		<LocaleProvider>
			<Outlet />
			<footer className="example-footer">Example: {EXAMPLE_NAME}</footer>
		</LocaleProvider>
	);
}
