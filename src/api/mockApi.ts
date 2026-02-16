import { v4 as uuidv4 } from 'uuid';
import type {
	Designer,
	Object3DItem,
	CreateDesignerDTO,
	UpdateDesignerDTO,
	CreateObjectDTO,
	UpdateObjectDTO,
} from '../types';

const STORAGE_KEYS = {
	DESIGNERS: 'dashboard3d_designers',
	OBJECTS: 'dashboard3d_objects',
};

const SIMULATED_DELAY = 200;

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

function saveToStorage<T>(key: string, data: T[]) {
	localStorage.setItem(key, JSON.stringify(data));
}

// In-memory stores localStorage
let designers: Designer[] = loadFromStorage<Designer>(STORAGE_KEYS.DESIGNERS, []);

let objects: Object3DItem[] = loadFromStorage<Object3DItem>(STORAGE_KEYS.OBJECTS, []);

function delay<T>(value: T): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY));
}

function recalcAttachedCounts() {
	const counts: Record<string, number> = {};
	for (const obj of objects) {
		counts[obj.designerId] = (counts[obj.designerId] || 0) + 1;
	}
	designers = designers.map((d) => ({
		...d,
		attachedObjectsCount: counts[d.id] || 0,
	}));
	saveToStorage(STORAGE_KEYS.DESIGNERS, designers);
}

// ─── Designers API ───────────────────────────────────────────

export async function getDesigners(): Promise<Designer[]> {
	recalcAttachedCounts();
	return delay([...designers]);
}

export async function createDesigner(data: CreateDesignerDTO): Promise<Designer> {
	const designer: Designer = {
		id: uuidv4(),
		fullName: data.fullName,
		workingHours: data.workingHours,
		attachedObjectsCount: 0,
	};
	designers.push(designer);
	saveToStorage(STORAGE_KEYS.DESIGNERS, designers);
	return delay(designer);
}

export async function updateDesigner(id: string, data: UpdateDesignerDTO): Promise<Designer> {
	const idx = designers.findIndex((d) => d.id === id);
	if (idx === -1) throw new Error('Designer not found');
	designers[idx] = { ...designers[idx], ...data };
	saveToStorage(STORAGE_KEYS.DESIGNERS, designers);
	return delay(designers[idx]);
}

export async function deleteDesigner(id: string): Promise<void> {
	designers = designers.filter((d) => d.id !== id);
	objects = objects.filter((o) => o.designerId !== id);
	saveToStorage(STORAGE_KEYS.DESIGNERS, designers);
	saveToStorage(STORAGE_KEYS.OBJECTS, objects);
	return delay(undefined);
}

// ─── Objects API ─────────────────────────────────────────────

export async function getObjects(): Promise<Object3DItem[]> {
	return delay([...objects]);
}

export async function createObject(data: CreateObjectDTO): Promise<Object3DItem> {
	const obj: Object3DItem = {
		id: uuidv4(),
		...data,
	};
	objects.push(obj);
	saveToStorage(STORAGE_KEYS.OBJECTS, objects);
	recalcAttachedCounts();
	return delay(obj);
}

export async function updateObject(id: string, data: UpdateObjectDTO): Promise<Object3DItem> {
	const idx = objects.findIndex((o) => o.id === id);
	if (idx === -1) throw new Error('Object not found');
	objects[idx] = { ...objects[idx], ...data };
	saveToStorage(STORAGE_KEYS.OBJECTS, objects);
	recalcAttachedCounts();
	return delay(objects[idx]);
}

export async function deleteObject(id: string): Promise<void> {
	objects = objects.filter((o) => o.id !== id);
	saveToStorage(STORAGE_KEYS.OBJECTS, objects);
	recalcAttachedCounts();
	return delay(undefined);
}
