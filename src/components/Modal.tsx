import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="modal-overlay"
			ref={overlayRef}
			onClick={(e) => {
				if (e.target === overlayRef.current) onClose();
			}}
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			<div className="modal-content">
				<div className="modal-header">
					<h2>{title}</h2>
					<button className="modal-close" onClick={onClose} aria-label="Close dialog">
						✕
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
}
