import { useState } from 'react';
import type { Designer, ObjectShape } from '../types';

const SHAPES: { value: ObjectShape; label: string; icon: string }[] = [
	{ value: 'box', label: 'Box', icon: '🧊' },
	{ value: 'sphere', label: 'Sphere', icon: '🔮' },
	{ value: 'cylinder', label: 'Cylinder', icon: '🥫' },
	{ value: 'cone', label: 'Cone', icon: '🔺' },
];

interface DesignerSelectDialogProps {
	designers: Designer[];
	onSelect: (designerId: string, shape: ObjectShape) => void;
	onCancel: () => void;
}

export default function DesignerSelectDialog({ designers, onSelect, onCancel }: DesignerSelectDialogProps) {
	const [selectedId, setSelectedId] = useState<string>('');
	const [selectedShape, setSelectedShape] = useState<ObjectShape>('box');
	const [error, setError] = useState('');

	const handleConfirm = () => {
		if (!selectedId) {
			setError('Please select a designer');
			return;
		}
		onSelect(selectedId, selectedShape);
	};

	return (
		<div className="designer-select-dialog">
			<p className="dialog-description">
				Select a designer and object shape before placing it on the canvas.
			</p>

			{/* Shape Selection */}
			<div className="shape-selection">
				<label className="shape-selection-label">Object Shape</label>
				<div className="shape-options">
					{SHAPES.map((s) => (
						<button
							key={s.value}
							type="button"
							className={`shape-option ${selectedShape === s.value ? 'selected' : ''}`}
							onClick={() => setSelectedShape(s.value)}
							title={s.label}
						>
							<span className="shape-icon">{s.icon}</span>
							<span className="shape-label">{s.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* Designer Selection */}
			<label className="shape-selection-label" style={{ marginTop: '0.5rem' }}>
				Designer
			</label>
			{designers.length === 0 ? (
				<div className="empty-state" style={{ padding: '1.5rem 0' }}>
					<p>No designers available. Please add a designer first.</p>
				</div>
			) : (
				<div className="designer-select-list">
					{designers.map((d) => (
						<label key={d.id} className={`designer-select-item ${selectedId === d.id ? 'selected' : ''}`}>
							<input
								type="radio"
								name="designer"
								value={d.id}
								checked={selectedId === d.id}
								onChange={() => {
									setSelectedId(d.id);
									setError('');
								}}
							/>
							<div className="select-item-avatar">
								{d.fullName
									.split(' ')
									.map((w) => w[0])
									.join('')
									.toUpperCase()
									.slice(0, 2)}
							</div>
							<div className="select-item-info">
								<span className="select-item-name">{d.fullName}</span>
								<span className="select-item-meta">
									{d.workingHours}h/day • {d.attachedObjectsCount} objects
								</span>
							</div>
						</label>
					))}
				</div>
			)}

			{error && <span className="field-error">{error}</span>}

			<div className="form-actions">
				<button className="btn btn-secondary" onClick={onCancel}>
					Cancel
				</button>
				<button className="btn btn-primary" onClick={handleConfirm} disabled={designers.length === 0}>
					Place Object
				</button>
			</div>
		</div>
	);
}
