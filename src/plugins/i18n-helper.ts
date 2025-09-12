import type { I18n } from 'vue-i18n';

let _i18n: I18n | null = null;

export function setupI18nHelper(i18n: I18n) {
	_i18n = i18n;
}

export function t(key: string, values?: Record<string, unknown>): string {
	if (_i18n) {
		const translate = _i18n.global.t as (
			k: string,
			v?: Record<string, unknown>
		) => string;
		return translate(key, values);
	}
	// Fallback to the key itself if i18n is not ready yet
	return key;
}
