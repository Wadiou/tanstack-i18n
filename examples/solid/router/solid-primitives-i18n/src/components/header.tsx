import { createSelector, For } from "solid-js";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/constants/locales";
import { useLocaleContext } from "@/i18n/provider";
import { LocalizedLink, useLocalizedNavigate } from "@/i18n/routes";
import { useTranslations } from "@/i18n/use-translations";

export function Header() {
  const localeContext = useLocaleContext();
  const navigate = useLocalizedNavigate();
  const t = useTranslations("Landing");
  const tCommon = useTranslations("Common");
  const isSelected = createSelector(() => localeContext.locale);

  return (
    <header>
      <nav>
        <LocalizedLink to="/">{t("homeLink")}</LocalizedLink>
        <LocalizedLink to="/about">{t("aboutLink")}</LocalizedLink>
        <button onClick={() => navigate({ to: "/" })} type="button">
          {t("programmaticHome")}
        </button>
      </nav>
      <div class="switcher">
        <label for="locale-select">{tCommon("switchLanguage")}</label>
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
