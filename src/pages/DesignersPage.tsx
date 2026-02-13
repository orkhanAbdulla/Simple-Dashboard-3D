import { useEffect, useState } from 'react';
import { useDesignerStore } from '../store/designerStore';
import Modal from '../components/Modal';
import AddDesignerForm from '../components/AddDesignerForm';

const DesignersPage = () => {
  const { designers, loading, load, add, remove } = useDesignerStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (data: { fullName: string; workingHours: number }) => {
    await add(data);
    setShowModal(false);
  };

  return (
    <div className="designers-page">
      <div className="page-header">
        <h1>Designers</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add New
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && designers.length === 0 && (
        <p className="empty-state">No designers yet. Click "Add New" to get started.</p>
      )}

      {designers.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Working Hours</th>
              <th>Attached Objects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {designers.map((d) => (
              <tr key={d.id}>
                <td>{d.fullName}</td>
                <td>{d.workingHours}h / day</td>
                <td>{d.attachedObjectsCount}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => remove(d.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <Modal title="Add Designer" onClose={() => setShowModal(false)}>
          <AddDesignerForm onSubmit={handleAdd} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
};

export default DesignersPage;
