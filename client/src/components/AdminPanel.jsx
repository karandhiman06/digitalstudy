import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, updateRoleStatus, deleteUser } from '../features/user/userSlice';

function AdminPanel() {
    const dispatch = useDispatch();
    const { users, isLoading } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const handleStatusUpdate = (id, role, status) => {
        dispatch(updateRoleStatus({ id, role, status }));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            dispatch(deleteUser(id));
        }
    };

    if (isLoading) return <div>Loading users...</div>;

    return (
        <div className='card mt-2' style={{ maxWidth: '100%' }}>
            <h2>Super Admin Panel</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '0.5rem' }}>Name</th>
                            <th style={{ padding: '0.5rem' }}>Email</th>
                            <th style={{ padding: '0.5rem' }}>Roles & Status</th>
                            <th style={{ padding: '0.5rem' }}>Actions</th>
                            <th style={{ padding: '0.5rem' }}>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem' }}>{u.name}</td>
                                <td style={{ padding: '0.5rem' }}>{u.email}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    {u.roles.map((r) => (
                                        <div key={r.role}>
                                            {r.role}: <span style={{ color: r.status === 'Approved' ? 'var(--success)' : r.status === 'Pending' ? 'orange' : 'var(--error)' }}>{r.status}</span>
                                        </div>
                                    ))}
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    {u.roles.map((r) => (
                                        r.status === 'Pending' && (
                                            <div key={r.role} style={{ marginBottom: '0.25rem' }}>
                                                <small>{r.role}: </small>
                                                <button
                                                    onClick={() => handleStatusUpdate(u._id, r.role, 'Approved')}
                                                    style={{ padding: '0.25rem 0.5rem', marginRight: '0.25rem', background: 'var(--success)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(u._id, r.role, 'Rejected')}
                                                    style={{ padding: '0.25rem 0.5rem', background: 'var(--error)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )
                                    ))}
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <button
                                        onClick={() => handleDelete(u._id)}
                                        style={{ padding: '0.25rem 0.5rem', background: 'var(--error)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPanel;
