import { Card, type CardProps } from "fumadocs-ui/components/card";
import { icons } from "lucide-react";
import { createElement, type ReactNode } from "react";

function resolveLucideIcon(icon: ReactNode): ReactNode {
  if (typeof icon !== "string") {
    return icon;
  }
  const Icon = icons[icon as keyof typeof icons];
  if (!Icon) {
    console.warn(`[docs-card] Unknown icon: ${icon}`);
    return icon;
  }
  return createElement(Icon);
}

export function DocsCard({ icon, ...props }: CardProps) {
  return <Card icon={resolveLucideIcon(icon)} {...props} />;
}
