import { useIntl } from "react-intl";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/constants/locales";
import { useLocaleContext } from "@/i18n/provider";
import { LocalizedLink, useLocalizedNavigate } from "@/i18n/routes";

export function Header() {
  const intl = useIntl();
  const { locale, setLocale } = useLocaleContext();
  const navigate = useLocalizedNavigate();

  return (
    <header>
      <nav>
        <LocalizedLink to="/">
          {intl.formatMessage({ id: "Landing.nav.homeLink" })}
        </LocalizedLink>
        <LocalizedLink to="/about">
          {intl.formatMessage({ id: "Landing.nav.aboutLink" })}
        </LocalizedLink>
        <button onClick={() => navigate({ to: "/" })} type="button">
          {intl.formatMessage({ id: "Landing.nav.programmaticHome" })}
        </button>
      </nav>
      <div className="switcher">
        <label htmlFor="locale-select">
          {intl.formatMessage({ id: "Common.switchLanguage" })}
        </label>
        <select
          id="locale-select"
          onChange={(e) => {
            setLocale(e.target.value as typeof locale);
          }}
          value={locale}
        >
          {SUPPORTED_LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
