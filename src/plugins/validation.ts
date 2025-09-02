import { configure } from 'vee-validate';

/**
 * Global vee-validate configuration for the app.
 *
 * Currently disables validateOnInput so validation doesn't trigger on each keystroke.
 *
 * If you later add Zod + i18n error messages globally, consider extending this module
 * (or another i18n-aware validation plugin) to keep main.ts clean.
 */
export function setupValidation() {
  configure({
    validateOnInput: false,
  });
}
