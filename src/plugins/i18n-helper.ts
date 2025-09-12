import type { I18n } from 'vue-i18n';

let _i18n: I18n | null = null;

export function setupI18nHelper(i18n: I18n) {
  _i18n = i18n;
}

export function t(key: string, values?: Record<string, unknown>): string {
  if (_i18n) {
    const translate = _i18n.global.t as (k: string, v?: Record<string, unknown>) => string;
    return translate(key, values);
  }
  // Fallback to the key itself if i18n is not ready yet
  return key;
}

function normalizeLocale(input?: string): 'en' | 'pl' {
  const l = (input || '').toLowerCase();
  return l === 'pl' ? 'pl' : 'en';
}

// Programmatically change the app locale safely anywhere (after setupI18nHelper was called)
export function setAppLocale(locale?: string) {
  if (!_i18n) return;
  const normalized = normalizeLocale(locale);
  // vue-i18n v9 composition API
  // @ts-ignore - .value exists in composition mode
  _i18n.global.locale.value = normalized;
}

export function getCurrentLocale(): 'en' | 'pl' {
  if (!_i18n) return 'en';
  // @ts-ignore
  return _i18n.global.locale.value as 'en' | 'pl';
}
