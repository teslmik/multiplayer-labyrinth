import { DIRECTIONS } from "../constants";

type PrefixType = "up" | "down" | "left" | "right";

export const transformDirection = (text: string): string => {
  const trimmedDirection = text.trim();

  if (trimmedDirection.startsWith('/') && trimmedDirection.length > 1) {
    const directionKey = trimmedDirection.slice(1) as PrefixType;

    if (DIRECTIONS['/'].includes(directionKey)) {
      return `(going ${directionKey})`;
    }
  }

  return text;
}