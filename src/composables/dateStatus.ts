import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

type BadgeVariant = 'warning' | 'destructive' | 'success';

export const useDueDateVariant = () => {
	const { t } = useI18n();

	const dueDateBadgeVariant = (dateInput: string | Date): BadgeVariant => {
		const due = dayjs(dateInput).startOf('day');
		const today = dayjs().startOf('day');

		if (!due.isValid()) {
			return 'success';
		}

		const diffDays = due.diff(today, 'day');

		if (diffDays < 0) {
			return 'destructive';
		} // overdue
		if (diffDays === 0) {
			return 'destructive';
		} // today
		if (diffDays === 1) {
			return 'warning';
		} // tomorrow

		return 'success';
	};

	const dueDateText = (dateInput: string | Date): string => {
		const due = dayjs(dateInput).startOf('day');
		const today = dayjs().startOf('day');

		if (!due.isValid()) {
			return '';
		}

		const diffDays = due.diff(today, 'day');

		if (diffDays < 0) {
			return t('calendar.outdated');
		}
		if (diffDays === 0) {
			return t('calendar.today');
		}
		if (diffDays === 1) {
			return t('calendar.tomorrow');
		}

		return due.format('MMM DD');
	};

	return {
		dueDateBadgeVariant,
		dueDateText,
	};
};
