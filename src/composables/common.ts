import { useMediaQuery, useBreakpoints } from '@vueuse/core';

// Tailwind CSS default breakpoints (v3/v4)
// xs: <640px (implicit)
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
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
	const isTabletScreen = useMediaQuery('(min-width: 768px) and (max-width: 1023.98px)');
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
