import { getBasePath } from "./get-base-path";

describe('splitUri', () => {
  it('returns empty basePath with empty uri', () => {
    expect(getBasePath('')).toEqual('');
  });

  it('returns empty basePath with / uri', () => {
    expect(getBasePath('/')).toEqual('');
  });

  it('returns /base basePath with /base uri', () => {
    expect(getBasePath('/base')).toEqual('/base');
  });

  it('returns /base basePath with /base/ uri', () => {
    expect(getBasePath('/base/')).toEqual('/base');
  });

  it('returns /base basePath with /base/and/more uri', () => {
    expect(getBasePath('/base/and/more')).toEqual('/base');
  });

  it('returns /base basePath with /base/file.html uri', () => {
    expect(getBasePath('/base/file.html')).toEqual('/base');
  });

  it('returns /base basePath with /base/_next/file.html uri', () => {
    expect(getBasePath('/base/_next/file.html')).toEqual('/base');
  });

  it('returns empty basePath with /_next/file.html uri', () => {
    expect(getBasePath('/_next/file.html')).toEqual('');
  });


  it('returns empty basePath with /favicon.ico uri', () => {
    expect(getBasePath('/favicon.ico')).toEqual('');
  });
});
