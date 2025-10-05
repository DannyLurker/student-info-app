import path from "path";
import { fileURLToPath } from "url";

export function getDirname(metaUrl: string): string {
  return path.dirname(fileURLToPath(metaUrl));
}

export function getFilename(metaUrl: string): string {
  return fileURLToPath(metaUrl);
}
