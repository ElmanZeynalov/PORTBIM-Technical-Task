import { useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import Canvas3D from '../components/Canvas3D';
import PropertiesPanel from '../components/PropertiesPanel';
import DesignerSelectDialog from '../components/DesignerSelectDialog';
import Modal from '../components/Modal';
import { useObjectsStore } from '../stores/objectsStore';
import { useDesignersStore } from '../stores/designersStore';
import { useEditorStore } from '../stores/editorStore';

export default function EditorPage() {
	const { objects, fetchObjects, addObject } = useObjectsStore();
	const { designers, fetchDesigners } = useDesignersStore();
	const { selectedId, clearSelection } = useEditorStore();

	const [pendingPosition, setPendingPosition] = useState<THREE.Vector3 | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		fetchObjects();
		fetchDesigners();
	}, [fetchObjects, fetchDesigners]);

	const selectedObject = objects.find((o) => o.id === selectedId);

	const handleDoubleClick = useCallback((point: THREE.Vector3) => {
		setPendingPosition(point);
		setDialogOpen(true);
	}, []);

	const handleDesignerSelect = async (designerId: string, shape: import('../types').ObjectShape) => {
		if (!pendingPosition) return;

		const objectCount = objects.length + 1;
		await addObject({
			name: `Object ${objectCount}`,
			designerId,
			color: getRandomColor(),
			position: {
				x: Math.round(pendingPosition.x * 100) / 100,
				y: 0,
				z: Math.round(pendingPosition.z * 100) / 100,
			},
			size: 'normal',
			shape,
		});

		setDialogOpen(false);
		setPendingPosition(null);
		await fetchDesigners();
	};

	return (
		<div className="editor-page">
			<div className="editor-canvas-area">
				<Canvas3D onDoubleClick={handleDoubleClick} />
			</div>

			<aside className={`editor-sidebar ${selectedObject ? 'open' : ''}`}>
				{selectedObject ? (
					<PropertiesPanel key={selectedObject.id} object={selectedObject} />
				) : (
					<div className="sidebar-empty">
						<div className="sidebar-empty-icon">🎯</div>
						<h3>No Object Selected</h3>
						<p>Click an object to view and edit its properties</p>
					</div>
				)}
			</aside>

			<Modal
				open={dialogOpen}
				onClose={() => {
					setDialogOpen(false);
					setPendingPosition(null);
				}}
				title="Select Designer"
			>
				<DesignerSelectDialog
					designers={designers}
					onSelect={handleDesignerSelect}
					onCancel={() => {
						setDialogOpen(false);
						setPendingPosition(null);
					}}
				/>
			</Modal>
		</div>
	);
}

function getRandomColor(): string {
	const colors = [
		'#7c3aed',
		'#06b6d4',
		'#10b981',
		'#f59e0b',
		'#ef4444',
		'#ec4899',
		'#8b5cf6',
		'#14b8a6',
		'#f97316',
		'#6366f1',
	];
	return colors[Math.floor(Math.random() * colors.length)];
}
