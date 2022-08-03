import { RouteItem } from '@millihq/tfn-dynamodb-actions';
import { findAliasWithBasePath } from './find-alias-with-base-path';

describe('findAliasWithBasePath', () => {
  it('throw error if no alias with basePath', () => {
    const aliases = [{ BasePath: '/' }] as RouteItem[];
    expect(() => {
      findAliasWithBasePath(aliases);
    }).toThrow();
  });

  it('find alias by basePath', () => {
    const aliases = [{ BasePath: '/' }, { BasePath: '/base' }] as RouteItem[];
    expect(findAliasWithBasePath(aliases)).toMatchObject({ BasePath: '/base' });
  });
});
