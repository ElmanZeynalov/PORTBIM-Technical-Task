export type ObjectSize = 'small' | 'normal' | 'large';
export type ObjectShape = 'box' | 'sphere' | 'cylinder' | 'cone';

export interface Position {
	x: number;
	y: number;
	z: number;
}

export interface Designer {
	id: string;
	fullName: string;
	workingHours: number;
	attachedObjectsCount: number;
}

export interface Object3DItem {
	id: string;
	name: string;
	designerId: string;
	color: string;
	position: Position;
	size: ObjectSize;
	shape: ObjectShape;
}

export type CreateDesignerDTO = Omit<Designer, 'id' | 'attachedObjectsCount'>;
export type UpdateDesignerDTO = Partial<CreateDesignerDTO>;

export type CreateObjectDTO = Omit<Object3DItem, 'id'>;
export type UpdateObjectDTO = Partial<Omit<Object3DItem, 'id'>>;
