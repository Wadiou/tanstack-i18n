import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/constants/locales";
import { useLocaleContext } from "@/i18n/provider";
import { LocalizedLink, useLocalizedNavigate } from "@/i18n/routes";
import {
  aboutLink,
  homeLink,
  programmaticHome,
  switcherLabel,
} from "@/paraglide/messages";

export function Header() {
  const { locale, setLocale } = useLocaleContext();
  const navigate = useLocalizedNavigate();

  return (
    <header>
      <nav>
        <LocalizedLink to="/">{homeLink()}</LocalizedLink>
        <LocalizedLink to="/about">{aboutLink()}</LocalizedLink>
        <button onClick={() => navigate({ to: "/" })} type="button">
          {programmaticHome()}
        </button>
      </nav>
      <div className="switcher">
        <label htmlFor="locale-select">{switcherLabel()}</label>
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
