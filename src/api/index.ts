// API abstraction layer.
// Currently uses the mock implementation.
// Swap the import below to point at a real API client when available.

export {
	getDesigners,
	createDesigner,
	updateDesigner,
	deleteDesigner,
	getObjects,
	createObject,
	updateObject,
	deleteObject,
} from './mockApi';
