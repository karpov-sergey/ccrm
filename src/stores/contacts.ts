import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';

// i18n helper for stores (outside components)
import { t as $t } from '@/plugins/i18n-helper';

import {
	createContact,
	deleteContacts,
	getAllContacts,
	updateContact,
} from '@/api/contacts';

import type { Contact, UpdateContactPayload } from '@/types/Contacts.ts';

interface ContactsState {
	contacts: Contact[];
}

export const useContactsStore = defineStore('contacts', {
	state: (): ContactsState => ({
		contacts: [],
	}),

	getters: {
		contactsList(): Contact[] {
			return this.contacts;
		},
	},

	actions: {
		async fetchContactsList() {
			try {
				this.contacts = await getAllContacts();
			} catch (error) {
				toast.error($t('failed_to_fetch_contacts'));
			}
		},

		async removeContactsByIds(ids: string[]) {
			try {
				await deleteContacts(ids);
			} catch (error) {
				toast.error($t('failed_to_delete_contacts'));
			}
		},

		async updateContact(data: UpdateContactPayload) {
			try {
				await updateContact(data);
			} catch (error) {
				toast.error($t('failed_to_update_contact'));
			}
		},

		async createContact(data: UpdateContactPayload) {
			try {
				await createContact(data);
			} catch (error) {
				toast.error($t('failed_to_create_contact'));
			}
		},
	},
});
