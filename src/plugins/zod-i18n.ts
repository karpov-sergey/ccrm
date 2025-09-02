import type { I18n } from 'vue-i18n';
import * as z from 'zod';

function makeZodI18nErrorMap(i18n: I18n) {
	return (
		issue: z.ZodIssueOptionalMessage,
		ctx: z.ErrorMapCtx
	): { message: string } => {
		const t = i18n.global.t as (
			key: string,
			values?: Record<string, unknown>
		) => string;

		switch (issue.code) {
			case z.ZodIssueCode.too_small: {
				if (issue.type === 'string') {
					if (issue.minimum === 1 && issue.inclusive) {
						return { message: t('validation.string.required') };
					}
					return {
						message: t('validation.string.min', { min: issue.minimum }),
					};
				}
				if (issue.type === 'number') {
					return {
						message: t('validation.number.min', { min: issue.minimum }),
					};
				}
				if (issue.type === 'array') {
					return { message: t('validation.array.min', { min: issue.minimum }) };
				}
				return { message: ctx.defaultError };
			}
			case z.ZodIssueCode.too_big: {
				if (issue.type === 'string') {
					return {
						message: t('validation.string.max', { max: issue.maximum }),
					};
				}
				if (issue.type === 'number') {
					return {
						message: t('validation.number.max', { max: issue.maximum }),
					};
				}
				if (issue.type === 'array') {
					return { message: t('validation.array.max', { max: issue.maximum }) };
				}
				return { message: ctx.defaultError };
			}
			case z.ZodIssueCode.invalid_type: {
				if (issue.expected === 'string') {
					return { message: t('validation.string.required') };
				}
				return {
					message: t('validation.type.invalid', { expected: issue.expected }),
				};
			}
			case z.ZodIssueCode.invalid_string: {
				if (issue.validation === 'email')
					return { message: t('validation.string.email') };
				if (issue.validation === 'url')
					return { message: t('validation.string.url') };
				if (issue.validation === 'uuid')
					return { message: t('validation.string.uuid') };
				if (issue.validation === 'regex')
					return { message: t('validation.string.regex') };
				return { message: ctx.defaultError };
			}
			case z.ZodIssueCode.invalid_enum_value: {
				return { message: t('validation.enum.invalid') };
			}
			case z.ZodIssueCode.not_multiple_of: {
				return {
					message: t('validation.number.multipleOf', {
						multipleOf: issue.multipleOf,
					}),
				};
			}
			case z.ZodIssueCode.custom: {
				return { message: t('validation.custom') };
			}
			default:
				return {
					message: t('validation.default', { defaultError: ctx.defaultError }),
				};
		}
	};
}

export function setupZodI18n(i18n: I18n) {
	z.setErrorMap(makeZodI18nErrorMap(i18n));
}
