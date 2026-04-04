import JailMonkey from 'jail-monkey';

/** Root (Android) o jailbreak (iOS), según JailMonkey. */
export function isRootOrJailbreakDetected(): boolean {
  return JailMonkey.isJailBroken();
}
