import { useState, useEffect } from 'react';
import { useObjectStore } from '../store/objectStore';
import { useDesignerStore } from '../store/designerStore';
import type { ObjectSize } from '../types';

const COLORS = ['#4a90d9', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

interface Props {
  objectId: string;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const PropertiesPanel = ({ objectId, onClose, onDelete }: Props) => {
  const obj = useObjectStore((s) => s.objects.find((o) => o.id === objectId));
  const update = useObjectStore((s) => s.update);
  const designers = useDesignerStore((s) => s.designers);

  const [name, setName] = useState('');
  const [designerId, setDesignerId] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState<ObjectSize>('normal');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (obj) {
      setName(obj.name);
      setDesignerId(obj.designerId);
      setColor(obj.color);
      setSize(obj.size);
      setErrors({});
      setSaved(false);
    }
  }, [obj]);

  if (!obj) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }
    if (!designerId) {
      errs.designerId = 'A designer must be selected';
    }
    if (!color) {
      errs.color = 'A color must be selected';
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSaved(false);
      return;
    }
    setErrors({});
    await update(objectId, { name: name.trim(), designerId, color, size });
    setSaved(true);
  };

  return (
    <aside className="properties-panel" role="complementary" aria-label="Object properties">
      <div className="panel-header">
        <h3 id="properties-title">Properties</h3>
        <button className="modal-close" onClick={onClose} aria-label="Close properties panel">&times;</button>
      </div>

      <div className="form" role="form" aria-labelledby="properties-title">
        <div className="form-group">
          <label htmlFor="prop-name">Name</label>
          <input
            id="prop-name"
            value={name}
            onChange={(e) => { setName(e.target.value); setSaved(false); }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'prop-name-error' : undefined}
          />
          {errors.name && <span className="error" id="prop-name-error" role="alert">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="prop-designer">Designer</label>
          <select
            id="prop-designer"
            value={designerId}
            onChange={(e) => { setDesignerId(e.target.value); setSaved(false); }}
            aria-invalid={!!errors.designerId}
            aria-describedby={errors.designerId ? 'prop-designer-error' : undefined}
          >
            {designers.map((d) => (
              <option key={d.id} value={d.id}>{d.fullName}</option>
            ))}
          </select>
          {errors.designerId && <span className="error" id="prop-designer-error" role="alert">{errors.designerId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="prop-size">Size</label>
          <select
            id="prop-size"
            value={size}
            onChange={(e) => { setSize(e.target.value as ObjectSize); setSaved(false); }}
          >
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
          </select>
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
                onClick={() => { setColor(c); setSaved(false); }}
              />
            ))}
          </div>
          {errors.color && <span className="error" role="alert">{errors.color}</span>}
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
          <button className="btn btn-danger" onClick={() => onDelete(objectId)}>Delete</button>
        </div>
        {saved && <span className="success" role="status">Changes saved</span>}
      </div>
    </aside>
  );
};

export default PropertiesPanel;
