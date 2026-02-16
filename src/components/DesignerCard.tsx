import type { Designer } from '../types';

interface DesignerCardProps {
	designer: Designer;
	onEdit: (designer: Designer) => void;
	onDelete: (id: string) => void;
}

export default function DesignerCard({ designer, onEdit, onDelete }: DesignerCardProps) {
	return (
		<div className="designer-card">
			<div className="card-avatar">
				{designer.fullName
					.split(' ')
					.map((w) => w[0])
					.join('')
					.toUpperCase()
					.slice(0, 2)}
			</div>
			<div className="card-info">
				<h3 className="card-name">{designer.fullName}</h3>
				<div className="card-meta">
					<span className="meta-item">
						<span className="meta-icon">🕐</span>
						{designer.workingHours}h / day
					</span>
					<span className="meta-item">
						<span className="meta-icon">📦</span>
						{designer.attachedObjectsCount} object{designer.attachedObjectsCount !== 1 ? 's' : ''}
					</span>
				</div>
			</div>
			<div className="card-actions">
				<button
					className="btn-icon"
					onClick={() => onEdit(designer)}
					aria-label={`Edit ${designer.fullName}`}
					title="Edit"
				>
					✏️
				</button>
				<button
					className="btn-icon btn-danger"
					onClick={() => onDelete(designer.id)}
					aria-label={`Delete ${designer.fullName}`}
					title="Delete"
				>
					🗑️
				</button>
			</div>
		</div>
	);
}
