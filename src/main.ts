import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n, type I18n } from 'vue-i18n';
import { setupI18nHelper } from './plugins/i18n-helper';

import './style.css';
import App from './App.vue';
import router from './router';

import en from './locales/en.json';
import pl from './locales/pl.json';
import { setupValidation } from './plugins/validation';

import { setupZodI18n } from './plugins/zod-i18n';

const i18n: I18n = createI18n({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'pl',
	messages: {
		en,
		pl,
	},
});

// Initialize global validation settings
setupValidation();

// Setup Zod + i18n error messages globally
setupZodI18n(i18n);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
setupI18nHelper(i18n);
app.mount('#app');
