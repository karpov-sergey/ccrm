import type { Currency } from '@/types/common.ts';

export const currencies: Currency[] = [
	{ code: 'USD', name: 'US Dollar', symbol: '$' },
	{ code: 'EUR', name: 'Euro', symbol: '€' },
	{ code: 'GBP', name: 'British Pound', symbol: '£' },
	{ code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
	{ code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
	{ code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
	{ code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
	{ code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
	{ code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
	{ code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
	{ code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
	{ code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
	{ code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
	{ code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
	{ code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
	{ code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
] as const;
