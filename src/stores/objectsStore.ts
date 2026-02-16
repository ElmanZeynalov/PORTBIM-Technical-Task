import { create } from 'zustand';
import type { Object3DItem, CreateObjectDTO, UpdateObjectDTO } from '../types';
import * as api from '../api';

interface ObjectsState {
	objects: Object3DItem[];
	loading: boolean;
	error: string | null;
	fetchObjects: () => Promise<void>;
	addObject: (data: CreateObjectDTO) => Promise<Object3DItem>;
	updateObject: (id: string, data: UpdateObjectDTO) => Promise<void>;
	deleteObject: (id: string) => Promise<void>;
}

export const useObjectsStore = create<ObjectsState>((set) => ({
	objects: [],
	loading: false,
	error: null,

	fetchObjects: async () => {
		set({ loading: true, error: null });
		try {
			const objects = await api.getObjects();
			set({ objects, loading: false });
		} catch (e) {
			set({ error: (e as Error).message, loading: false });
		}
	},

	addObject: async (data) => {
		const obj = await api.createObject(data);
		set((s) => ({ objects: [...s.objects, obj] }));
		return obj;
	},

	updateObject: async (id, data) => {
		const updated = await api.updateObject(id, data);
		set((s) => ({
			objects: s.objects.map((o) => (o.id === id ? updated : o)),
		}));
	},

	deleteObject: async (id) => {
		await api.deleteObject(id);
		set((s) => ({ objects: s.objects.filter((o) => o.id !== id) }));
	},
}));
