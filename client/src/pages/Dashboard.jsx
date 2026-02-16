import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import RoleSelection from '../components/RoleSelection';
import AdminPanel from '../components/AdminPanel';

function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Welcome {user && user.name}</h1>
            <p>Roles: {user && user.roles.map(r => `${r.role} (${r.status})`).join(', ')}</p>

            <button className="btn" onClick={onLogout} style={{ maxWidth: '200px', marginTop: '1rem' }}>
                Logout
            </button>

            {/* Admin Panel */}
            {user && user.roles.some(r => r.role === 'Administrative' && r.status === 'Approved') && (
                <div style={{ marginTop: '2rem' }}>
                    <AdminPanel />
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                {/* Role Selection */}
                <RoleSelection />

                {/* Dashboards based on Approved Roles */}
                {user && user.roles.find(r => r.role === 'Student' && r.status === 'Approved') && (
                    <div className="card">
                        <h2>Student Dashboard</h2>
                        <p>Welcome to your student portal. Access your courses here.</p>
                        <button className="btn mt-2" onClick={() => navigate('/profile?role=Student')}>Edit Profile</button>
                        <button className="btn mt-2" style={{ marginLeft: '0.5rem', background: 'var(--surface-hover)' }} onClick={() => navigate('/student-forms')}>My Forms</button>
                    </div>
                )}

                {user && user.roles.find(r => r.role === 'Teacher' && r.status === 'Approved') && (
                    <div className="card">
                        <h2>Teacher Dashboard</h2>
                        <p>Welcome to your teacher portal. Manage your classes here.</p>
                        <button className="btn mt-2" onClick={() => navigate('/profile?role=Teacher')}>Edit Profile</button>
                        <button className="btn mt-2" style={{ marginLeft: '0.5rem', background: 'var(--surface-hover)' }} onClick={() => navigate('/create-form')}>Create Form</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
