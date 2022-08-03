import { RouteItem } from '@millihq/tfn-dynamodb-actions';

export function findAliasWithBasePath(aliases: RouteItem[]) {
  const alias = aliases.find((a) => {
    return a.BasePath !== '/';
  });
  if (!alias) {
    throw new Error("Couldn't find alias with basePath");
  }
  return alias;
}
