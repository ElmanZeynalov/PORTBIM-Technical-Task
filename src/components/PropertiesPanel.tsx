import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDesignersStore } from '../stores/designersStore';
import { useObjectsStore } from '../stores/objectsStore';
import { useEditorStore } from '../stores/editorStore';
import type { Object3DItem } from '../types';
import Modal from './Modal';

const propertiesSchema = z.object({
	name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
	designerId: z.string().min(1, 'Designer is required'),
	size: z.enum(['small', 'normal', 'large']),
	shape: z.enum(['box', 'sphere', 'cylinder', 'cone']),
	color: z.string().min(1, 'Color is required'),
});

type PropertiesFormValues = z.infer<typeof propertiesSchema>;

interface PropertiesPanelProps {
	object: Object3DItem;
}

export default function PropertiesPanel({ object }: PropertiesPanelProps) {
	const designers = useDesignersStore((s) => s.designers);
	const updateObject = useObjectsStore((s) => s.updateObject);
	const fetchDesigners = useDesignersStore((s) => s.fetchDesigners);
	const deleteObject = useObjectsStore((s) => s.deleteObject);
	const clearSelection = useEditorStore((s) => s.clearSelection);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<PropertiesFormValues>({
		resolver: zodResolver(propertiesSchema),
		defaultValues: {
			name: object.name,
			designerId: object.designerId,
			size: object.size,
			shape: object.shape ?? 'box',
			color: object.color,
		},
	});
	const [confirmDelete, setConfirmDelete] = useState(false);

	const onSubmit = async (data: PropertiesFormValues) => {
		await updateObject(object.id, data);
		await fetchDesigners();
	};

	const handleDelete = async () => {
		clearSelection();
		await deleteObject(object.id);
		await fetchDesigners();
		setConfirmDelete(false);
	};

	const designer = designers.find((d) => d.id === object.designerId);

	return (
		<div className="properties-panel">
			<div className="panel-header">
				<h3>Properties</h3>
				<button
					className="btn-icon btn-danger"
					onClick={() => setConfirmDelete(true)}
					title="Delete object"
					aria-label="Delete object"
				>
					🗑️
				</button>
			</div>

			<div className="panel-object-preview">
				<div className="preview-color-swatch" style={{ backgroundColor: object.color }} />
				<div>
					<span className="preview-name">{object.name}</span>
					<span className="preview-designer">{designer?.fullName ?? 'Unknown'}</span>
				</div>
			</div>

			<form className="properties-form" onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className="form-field">
					<label htmlFor="prop-name">Name</label>
					<input id="prop-name" type="text" {...register('name')} />
					{errors.name && <span className="field-error">{errors.name.message}</span>}
				</div>

				<div className="form-field">
					<label htmlFor="prop-designer">Designer</label>
					<select id="prop-designer" {...register('designerId')}>
						<option value="">Select…</option>
						{designers.map((d) => (
							<option key={d.id} value={d.id}>
								{d.fullName}
							</option>
						))}
					</select>
					{errors.designerId && <span className="field-error">{errors.designerId.message}</span>}
				</div>

				<div className="form-field">
					<label htmlFor="prop-size">Size</label>
					<select id="prop-size" {...register('size')}>
						<option value="small">Small</option>
						<option value="normal">Normal</option>
						<option value="large">Large</option>
					</select>
				</div>

				<div className="form-field">
					<label htmlFor="prop-shape">Shape</label>
					<select id="prop-shape" {...register('shape')}>
						<option value="box">🧊 Box</option>
						<option value="sphere">🔮 Sphere</option>
						<option value="cylinder">🥫 Cylinder</option>
						<option value="cone">🔺 Cone</option>
					</select>
				</div>

				<div className="form-field">
					<label htmlFor="prop-color">Color</label>
					<div className="color-input-wrapper">
						<input id="prop-color" type="color" {...register('color')} />
						<span className="color-value">{object.color}</span>
					</div>
				</div>

				<div className="form-field">
					<label>Position</label>
					<div className="position-display">
						X: {object.position.x.toFixed(2)} &nbsp; Y: {object.position.y.toFixed(2)} &nbsp; Z:{' '}
						{object.position.z.toFixed(2)}
					</div>
				</div>

				<button type="submit" className="btn btn-primary btn-full" disabled={!isDirty}>
					Save Changes
				</button>
			</form>

			<Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Object">
				<div className="confirm-dialog">
					<p className="confirm-message">
						Are you sure you want to delete <strong>{object.name}</strong>? This action cannot be undone.
					</p>
					<div className="form-actions">
						<button className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>
							Cancel
						</button>
						<button className="btn btn-danger-solid" onClick={handleDelete}>
							🗑️ Delete
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
