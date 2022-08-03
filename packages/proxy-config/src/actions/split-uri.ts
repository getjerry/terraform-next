import { splitAtCharacter } from '../utils/split-at-character';

export function splitUri(uri: string) {
  if (!uri.match('/')) return [uri, '/'];
  const parts = splitAtCharacter(uri, '/');
  return [parts[0], `/${parts[1]}`];
}
