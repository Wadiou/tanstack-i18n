import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { localizedRedirect } from "@/i18n/routes";
import { aboutDescription, aboutTitle } from "@/paraglide/messages";

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
	return (
		<div className="layout">
			<Header />
			<h1>{aboutTitle()}</h1>
			<p>{aboutDescription()}</p>
		</div>
	);
}
