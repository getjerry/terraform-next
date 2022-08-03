import { splitUri } from "./split-uri";

describe('splitUri', () => {
  it('returns dep.example.com and / basePath with dep.example.com', () => {
    expect(splitUri('dep.example.com')).toEqual(['dep.example.com', '/'])
  });

  it('returns dep.example.com and / basePath with dep.example.com/', () => {
    expect(splitUri('dep.example.com')).toEqual(['dep.example.com', '/'])
  });

  it('returns dep.example.com and /base basePath with dep.example.com/base', () => {
    expect(splitUri('dep.example.com/base')).toEqual(['dep.example.com', '/base'])
  });

  it('returns c76b399cdd28a2a5d59dec5fc33a2716 and /base basePath with c76b399cdd28a2a5d59dec5fc33a2716/base', () => {
    expect(splitUri('c76b399cdd28a2a5d59dec5fc33a2716/base')).toEqual(['c76b399cdd28a2a5d59dec5fc33a2716', '/base']);
  });

  it('returns c76b399cdd28a2a5d59dec5fc33a2716 and / basePath with c76b399cdd28a2a5d59dec5fc33a2716', () => {
    expect(splitUri('c76b399cdd28a2a5d59dec5fc33a2716')).toEqual(['c76b399cdd28a2a5d59dec5fc33a2716', '/']);
  });

  it('returns c76b399cdd28a2a5d59dec5fc33a2716 and / basePath with c76b399cdd28a2a5d59dec5fc33a2716/', () => {
    expect(splitUri('c76b399cdd28a2a5d59dec5fc33a2716/')).toEqual(['c76b399cdd28a2a5d59dec5fc33a2716', '/']);
  });
});
