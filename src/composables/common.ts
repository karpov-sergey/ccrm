import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { useMediaQuery, useBreakpoints } from '@vueuse/core';

import { useAuthStore } from '@/stores/auth.ts';

export const useScreenWidth = () => {
	// Up queries (>=)
	const isSmUp = useMediaQuery('(min-width: 640px)');
	const isMdUp = useMediaQuery('(min-width: 768px)');
	const isLgUp = useMediaQuery('(min-width: 1024px)');
	const isXlUp = useMediaQuery('(min-width: 1280px)');
	const is2XlUp = useMediaQuery('(min-width: 1536px)');

	// Only-range helpers
	const isXs = useMediaQuery('(max-width: 639.98px)');
	const isSm = useMediaQuery('(min-width: 640px) and (max-width: 767.98px)');
	const isMd = useMediaQuery('(min-width: 768px) and (max-width: 1023.98px)');
	const isLg = useMediaQuery('(min-width: 1024px) and (max-width: 1279.98px)');
	const isXl = useMediaQuery('(min-width: 1280px) and (max-width: 1535.98px)');
	const is2Xl = useMediaQuery('(min-width: 1536px)');

	// Exclusive categories (mobile/tablet/desktop) - non-overlapping
	// mobile: <768 (below md)
	// tablet: >=768 and <1024 (md-only)
	// desktop: >=1024 (lg and up)
	const isMobileScreen = useMediaQuery('(max-width: 767.98px)');
	const isTabletScreen = useMediaQuery(
		'(min-width: 768px) and (max-width: 1023.98px)'
	);
	const isLargeScreen = useMediaQuery('(min-width: 1024px)');

	// Optional: current breakpoint using VueUse breakpoints helper
	const breakpoints = useBreakpoints({
		sm: 640,
		md: 768,
		lg: 1024,
		xl: 1280,
		'2xl': 1536,
	});
	const currentBreakpoint = breakpoints.active();

	return {
		// Tailwind up helpers
		isSmUp,
		isMdUp,
		isLgUp,
		isXlUp,
		is2XlUp,

		// Tailwind only-range helpers
		isXs,
		isSm,
		isMd,
		isLg,
		isXl,
		is2Xl,

		// Backward compatibility
		isMobileScreen,
		isTabletScreen,
		isLargeScreen,

		// Extra info
		currentBreakpoint,
	};
};

export const useNameAbbreviation = () => {
	const nameAbbreviation = (fullName: string) => {
		const firstName = fullName.split(' ')[0];
		const lastName = fullName.split(' ')[1];

		if (!lastName?.length) {
			return `${firstName.substring(0, 1).toUpperCase()}`;
		}

		return `${fullName.split(' ')[0].substring(0, 1).toUpperCase()} ${fullName.split(' ')[1].substring(0, 1).toUpperCase()}`;
	};

	return { nameAbbreviation };
};

export const useFormattedDate = () => {
	const { user } = storeToRefs(useAuthStore());

	const formattedDate = (date: Date | string) => {
		if (user.value?.user_metadata.timeFormat === '12h') {
			return dayjs(date).format('MMMM DD, YYYY');
		}

		return dayjs(date).format('DD MMMM, YYYY');
	};

	return { formattedDate };
};

export const useFormattedTime = () => {
	const { user } = storeToRefs(useAuthStore());

	const formattedTime = (time: string) => {
		const parsed = dayjs(`1970-01-01T${time}`);

		if (user.value?.user_metadata.timeFormat === '12h') {
			return parsed.format('hh:mm A');
		}
		return parsed.format('HH:mm');
	};

	return { formattedTime };
};

export const useFormattedDateTime = () => {
	const { user } = storeToRefs(useAuthStore());

	const formattedDateTime = (date: Date | string) => {
		if (user.value?.user_metadata.timeFormat === '12h') {
			return dayjs(date).format('hh:mm A MMMM DD, YYYY');
		}

		return dayjs(date).format('HH:mm DD MMMM, YYYY');
	};

	return { formattedDateTime };
};
