import { create } from 'zustand';

interface EditorState {
	hoveredId: string | null;
	selectedId: string | null;
	isDragging: boolean;
	setHovered: (id: string | null) => void;
	setSelected: (id: string | null) => void;
	setDragging: (dragging: boolean) => void;
	clearSelection: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
	hoveredId: null,
	selectedId: null,
	isDragging: false,
	setHovered: (id) => set({ hoveredId: id }),
	setSelected: (id) => set({ selectedId: id }),
	setDragging: (dragging) => set({ isDragging: dragging }),
	clearSelection: () => set({ selectedId: null }),
}));
