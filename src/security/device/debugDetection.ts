import JailMonkey from 'jail-monkey';

export function getDebuggedMode(): Promise<boolean> {
  return JailMonkey.isDebuggedMode();
}
