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
import { createI18n } from 'vue-i18n';

import './style.css';
import App from './App.vue';
import router from './router';

import en from './locales/en.json';
import pl from './locales/pl.json';

const i18n = createI18n({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'pl',
	messages: {
		en,
		pl,
	},
});

createApp(App).use(router).use(i18n).mount('#app');
