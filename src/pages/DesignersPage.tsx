import { useEffect, useState } from 'react';
import { useDesignersStore } from '../stores/designersStore';
import { useObjectsStore } from '../stores/objectsStore';
import DesignerCard from '../components/DesignerCard';
import DesignerForm from '../components/DesignerForm';
import Modal from '../components/Modal';
import type { Designer, CreateDesignerDTO } from '../types';

export default function DesignersPage() {
	const { designers, loading, fetchDesigners, addDesigner, updateDesigner, deleteDesigner } =
		useDesignersStore();
	const { fetchObjects } = useObjectsStore();

	const [modalOpen, setModalOpen] = useState(false);
	const [editingDesigner, setEditingDesigner] = useState<Designer | undefined>();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		fetchDesigners();
	}, [fetchDesigners]);

	const handleAdd = () => {
		setEditingDesigner(undefined);
		setModalOpen(true);
	};

	const handleEdit = (designer: Designer) => {
		setEditingDesigner(designer);
		setModalOpen(true);
	};

	const handleDeleteRequest = (id: string) => {
		setDeletingId(id);
	};

	const handleDeleteConfirm = async () => {
		if (!deletingId) return;
		await deleteDesigner(deletingId);
		await fetchDesigners();
		await fetchObjects();
		setDeletingId(null);
	};

	const handleSubmit = async (data: CreateDesignerDTO) => {
		if (editingDesigner) {
			await updateDesigner(editingDesigner.id, data);
		} else {
			await addDesigner(data);
		}
		setModalOpen(false);
		await fetchDesigners();
	};

	const deletingDesigner = deletingId ? designers.find((d) => d.id === deletingId) : null;

	return (
		<div className="designers-page">
			<div className="page-header">
				<div>
					<h2>Designers</h2>
					<p className="page-subtitle">
						Manage your team of {designers.length} designer{designers.length !== 1 ? 's' : ''}
					</p>
				</div>
				<button className="btn btn-primary btn-glow" onClick={handleAdd}>
					<span>+</span> Add New
				</button>
			</div>

			{loading ? (
				<div className="loading-state">
					<div className="spinner" />
					<p>Loading designers…</p>
				</div>
			) : designers.length === 0 ? (
				<div className="empty-state">
					<div className="empty-icon">👥</div>
					<h3>No Designers Yet</h3>
					<p>Add your first designer to get started</p>
					<button className="btn btn-primary" onClick={handleAdd}>
						+ Add Designer
					</button>
				</div>
			) : (
				<div className="designers-grid">
					{designers.map((d) => (
						<DesignerCard key={d.id} designer={d} onEdit={handleEdit} onDelete={handleDeleteRequest} />
					))}
				</div>
			)}

			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				title={editingDesigner ? 'Edit Designer' : 'Add New Designer'}
			>
				<DesignerForm
					key={editingDesigner?.id ?? 'new'}
					designer={editingDesigner}
					onSubmit={handleSubmit}
					onCancel={() => setModalOpen(false)}
				/>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal open={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Designer">
				<div className="confirm-dialog">
					<p className="confirm-message">
						Are you sure you want to delete <strong>{deletingDesigner?.fullName}</strong>? This action cannot
						be undone.
					</p>
					<div className="form-actions">
						<button className="btn btn-secondary" onClick={() => setDeletingId(null)}>
							Cancel
						</button>
						<button className="btn btn-danger-solid" onClick={handleDeleteConfirm}>
							🗑️ Delete
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
