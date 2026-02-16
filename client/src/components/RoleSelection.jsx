import { useDispatch, useSelector } from 'react-redux';
import { addRole } from '../features/user/userSlice';

function RoleSelection() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const hasRole = (roleName) => {
        return user?.roles.find((r) => r.role === roleName);
    };

    const handleRequestRole = (role) => {
        dispatch(addRole({ role }));
        // Ideally this should trigger a re-fetch or update local state, 
        // but for MVP we might need to refresh or update auth state manually.
        // In a real app, listen to socket or re-fetch profile.
        // For now, let's assume page reload or user re-login update.
        alert('Role requested! Please refresh page to see status updates or wait for admin approval.');
        window.location.reload();
    };

    return (
        <div className='card mt-2'>
            <h2>Select Your Role</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>

                {/* Student Role */}
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    <h3>Student</h3>
                    <p>Access study materials and track progress.</p>
                    {hasRole('Student') ? (
                        <p className="mt-2" style={{ color: hasRole('Student').status === 'Approved' ? 'var(--success)' : 'orange' }}>
                            Status: {hasRole('Student').status}
                        </p>
                    ) : (
                        <button className='btn mt-2' onClick={() => handleRequestRole('Student')}>
                            Request Access
                        </button>
                    )}
                </div>

                {/* Teacher Role */}
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    <h3>Teacher</h3>
                    <p>Manage courses and students.</p>
                    {hasRole('Teacher') ? (
                        <p className="mt-2" style={{ color: hasRole('Teacher').status === 'Approved' ? 'var(--success)' : 'orange' }}>
                            Status: {hasRole('Teacher').status}
                        </p>
                    ) : (
                        <button className='btn mt-2' onClick={() => handleRequestRole('Teacher')}>
                            Request Access
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default RoleSelection;
