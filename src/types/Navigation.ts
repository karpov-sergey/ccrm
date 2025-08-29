import type { FunctionalComponent } from 'vue';

export interface NavigationItem {
	label: string;
	to: string;
	icon: FunctionalComponent;
	id: string;
}
