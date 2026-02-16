import { create } from 'zustand';
import type { Designer, CreateDesignerDTO, UpdateDesignerDTO } from '../types';
import * as api from '../api';

interface DesignersState {
	designers: Designer[];
	loading: boolean;
	error: string | null;
	fetchDesigners: () => Promise<void>;
	addDesigner: (data: CreateDesignerDTO) => Promise<Designer>;
	updateDesigner: (id: string, data: UpdateDesignerDTO) => Promise<void>;
	deleteDesigner: (id: string) => Promise<void>;
}

export const useDesignersStore = create<DesignersState>((set) => ({
	designers: [],
	loading: false,
	error: null,

	fetchDesigners: async () => {
		set({ loading: true, error: null });
		try {
			const designers = await api.getDesigners();
			set({ designers, loading: false });
		} catch (e) {
			set({ error: (e as Error).message, loading: false });
		}
	},

	addDesigner: async (data) => {
		const designer = await api.createDesigner(data);
		set((s) => ({ designers: [...s.designers, designer] }));
		return designer;
	},

	updateDesigner: async (id, data) => {
		const updated = await api.updateDesigner(id, data);
		set((s) => ({
			designers: s.designers.map((d) => (d.id === id ? updated : d)),
		}));
	},

	deleteDesigner: async (id) => {
		await api.deleteDesigner(id);
		set((s) => ({ designers: s.designers.filter((d) => d.id !== id) }));
	},
}));
