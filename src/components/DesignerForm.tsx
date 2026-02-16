import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Designer } from '../types';

const designerSchema = z.object({
	fullName: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must be 100 characters or less'),
	workingHours: z
		.number({ invalid_type_error: 'Must be a number' })
		.min(1, 'Minimum 1 hour')
		.max(24, 'Maximum 24 hours'),
});

type DesignerFormValues = z.infer<typeof designerSchema>;

interface DesignerFormProps {
	designer?: Designer;
	onSubmit: (data: DesignerFormValues) => void;
	onCancel: () => void;
}

export default function DesignerForm({ designer, onSubmit, onCancel }: DesignerFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<DesignerFormValues>({
		resolver: zodResolver(designerSchema),
		defaultValues: {
			fullName: designer?.fullName ?? '',
			workingHours: designer?.workingHours ?? 8,
		},
	});

	return (
		<form className="designer-form" onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className="form-field">
				<label htmlFor="fullName">Full Name</label>
				<input id="fullName" type="text" placeholder="Enter full name" {...register('fullName')} autoFocus />
				{errors.fullName && <span className="field-error">{errors.fullName.message}</span>}
			</div>

			<div className="form-field">
				<label htmlFor="workingHours">Working Hours (per day)</label>
				<input
					id="workingHours"
					type="number"
					min={1}
					max={24}
					{...register('workingHours', { valueAsNumber: true })}
				/>
				{errors.workingHours && <span className="field-error">{errors.workingHours.message}</span>}
			</div>

			<div className="form-actions">
				<button type="button" className="btn btn-secondary" onClick={onCancel}>
					Cancel
				</button>
				<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
					{designer ? 'Update' : 'Add Designer'}
				</button>
			</div>
		</form>
	);
}
