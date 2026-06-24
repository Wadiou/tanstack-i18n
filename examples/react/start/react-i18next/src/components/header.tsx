import { useTranslation } from "react-i18next";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/constants/locales";
import { useLocaleContext } from "@/i18n/provider";
import { LocalizedLink, useLocalizedNavigate } from "@/i18n/routes";

export function Header() {
  const { t } = useTranslation(["landing", "common"]);
  const { locale, setLocale } = useLocaleContext();
  const navigate = useLocalizedNavigate();

  return (
    <header>
      <nav>
        <LocalizedLink to="/">{t("landing:nav.homeLink")}</LocalizedLink>
        <LocalizedLink to="/about">{t("landing:nav.aboutLink")}</LocalizedLink>
        <button onClick={() => navigate({ to: "/" })} type="button">
          {t("landing:nav.programmaticHome")}
        </button>
      </nav>
      <div className="switcher">
        <label htmlFor="locale-select">{t("common:switchLanguage")}</label>
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
