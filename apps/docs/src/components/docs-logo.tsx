interface DocsLogoProps {
  className?: string;
}

export function DocsLogo({ className }: DocsLogoProps) {
  return (
    <>
      <img
        alt="TanStack i18n"
        className={`block dark:hidden ${className ?? ""}`}
        height={48}
        src="/black-logo.png"
        width={192}
      />
      <img
        alt="TanStack i18n"
        className={`hidden dark:block ${className ?? ""}`}
        height={48}
        src="/white-logo.png"
        width={192}
      />
    </>
  );
}
