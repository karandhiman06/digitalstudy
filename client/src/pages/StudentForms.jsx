import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignedForms } from '../features/form/formSlice';
import { useNavigate } from 'react-router-dom';

function StudentForms() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { assignedForms, isLoading } = useSelector((state) => state.forms);

    useEffect(() => {
        dispatch(getAssignedForms());
    }, [dispatch]);

    if (isLoading) return <div>Loading forms...</div>;

    return (
        <div className='card mt-2' style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <h2>Assigned Forms</h2>
            {assignedForms.length === 0 ? (
                <p>No forms assigned to you yet.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                    {assignedForms.map((form) => (
                        <div key={form._id} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                            <h3>{form.title}</h3>
                            <p>{form.description}</p>
                            <button
                                className='btn mt-2'
                                onClick={() => navigate(`/take-form/${form._id}`)}
                            >
                                Take Form
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentForms;
