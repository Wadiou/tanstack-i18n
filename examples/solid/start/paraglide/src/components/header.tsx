import { createSelector, For } from "solid-js";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/constants/locales";
import { useLocaleContext } from "@/i18n/provider";
import { LocalizedLink, useLocalizedNavigate } from "@/i18n/routes";
import { t } from "@/i18n/t";
import {
  aboutLink,
  homeLink,
  programmaticHome,
  switcherLabel,
} from "@/paraglide/messages";

export function Header() {
  const localeContext = useLocaleContext();
  const navigate = useLocalizedNavigate();
  const t_homeLink = t(homeLink);
  const t_aboutLink = t(aboutLink);
  const t_programmaticHome = t(programmaticHome);
  const t_switcherLabel = t(switcherLabel);
  const isSelected = createSelector(() => localeContext.locale);

  return (
    <header>
      <nav>
        <LocalizedLink to="/">{t_homeLink()}</LocalizedLink>
        <LocalizedLink to="/about">{t_aboutLink()}</LocalizedLink>
        <button onClick={() => navigate({ to: "/" })} type="button">
          {t_programmaticHome()}
        </button>
      </nav>
      <div class="switcher">
        <label for="locale-select">{t_switcherLabel()}</label>
        <select
          id="locale-select"
          onChange={(e) => {
            localeContext.setLocale(e.currentTarget.value as SupportedLocale);
          }}
          value={localeContext.locale}
        >
          <For each={SUPPORTED_LOCALES}>
            {(code) => (
              <option selected={isSelected(code)} value={code}>
                {LOCALE_LABELS[code]}
              </option>
            )}
          </For>
        </select>
      </div>
    </header>
  );
}
