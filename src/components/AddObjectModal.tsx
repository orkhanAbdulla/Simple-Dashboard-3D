import { useState } from 'react';
import type { FormEvent } from 'react';
import { useDesignerStore } from '../store/designerStore';
import Modal from './Modal';

interface Props {
  onSubmit: (data: { name: string; designerId: string; color: string }) => void;
  onClose: () => void;
}

const COLORS = ['#4a90d9', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

const AddObjectModal = ({ onSubmit, onClose }: Props) => {
  const designers = useDesignerStore((s) => s.designers);
  const [name, setName] = useState('');
  const [designerId, setDesignerId] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!designerId) errs.designerId = 'Please select a designer';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ name: name.trim(), designerId, color });
  };

  return (
    <Modal title="Add Object" onClose={onClose}>
      {designers.length === 0 ? (
        <p>No designers available. Please add a designer first on the Designers page.</p>
      ) : (
        <form onSubmit={handleSubmit} className="form" aria-label="Add object form" noValidate>
          <div className="form-group">
            <label htmlFor="objName">Object Name</label>
            <input
              id="objName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main Building"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'objName-error' : undefined}
            />
            {errors.name && <span className="error" id="objName-error" role="alert">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="designer">Attached Designer</label>
            <select
              id="designer"
              value={designerId}
              onChange={(e) => setDesignerId(e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.designerId}
              aria-describedby={errors.designerId ? 'designer-error' : undefined}
            >
              <option value="">-- Select --</option>
              {designers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName}
                </option>
              ))}
            </select>
            {errors.designerId && <span className="error" id="designer-error" role="alert">{errors.designerId}</span>}
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker" role="radiogroup" aria-label="Object color">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={color === c}
                  aria-label={c}
                  className={`color-swatch ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Place Object
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddObjectModal;
