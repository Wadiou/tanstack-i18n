export function flattenMessages(
  nestedMessages: unknown,
  prefix = ""
): Record<string, string> {
  if (nestedMessages === null || typeof nestedMessages !== "object") {
    return { [prefix]: String(nestedMessages) };
  }
  const messages: Record<string, string> = {};
  for (const [key, value] of Object.entries(
    nestedMessages as Record<string, unknown>
  )) {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    } else {
      messages[prefixedKey] = String(value);
    }
  }
  return messages;
}
