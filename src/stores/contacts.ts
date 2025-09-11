import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';

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
				toast.error('Failed to fetch contacts');
			}
		},

		async removeContactsByIds(ids: string[]) {
			try {
				await deleteContacts(ids);
			} catch (error) {
				toast.error('Failed to delete contacts');
			}
		},

		async updateContact(data: UpdateContactPayload) {
			try {
				await updateContact(data);
			} catch (error) {
				toast.error('Failed to update contact');
			}
		},

		async createContact(data: UpdateContactPayload) {
			try {
				await createContact(data);
			} catch (error) {
				toast.error('Failed to create contact');
			}
		},
	},
});
