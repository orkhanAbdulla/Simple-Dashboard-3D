import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onSubmit: (data: { fullName: string; workingHours: number }) => void;
  onCancel: () => void;
}

const AddDesignerForm = ({ onSubmit, onCancel }: Props) => {
  const [fullName, setFullName] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }
    const hours = Number(workingHours);
    if (!workingHours || isNaN(hours) || hours < 1 || hours > 24) {
      errs.workingHours = 'Working hours must be between 1 and 24';
    }
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ fullName: fullName.trim(), workingHours: Number(workingHours) });
  };

  return (
    <form onSubmit={handleSubmit} className="form" aria-label="Add designer form" noValidate>
      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          aria-required="true"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && <span className="error" id="fullName-error" role="alert">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="workingHours">Working Hours (per day)</label>
        <input
          id="workingHours"
          type="number"
          min={1}
          max={24}
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
          placeholder="8"
          aria-required="true"
          aria-invalid={!!errors.workingHours}
          aria-describedby={errors.workingHours ? 'workingHours-error' : undefined}
        />
        {errors.workingHours && <span className="error" id="workingHours-error" role="alert">{errors.workingHours}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Add Designer
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddDesignerForm;
