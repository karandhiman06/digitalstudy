import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ProfileForm() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role');
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        // Fetch existing profile if any (omitted for MVP simplicity, we just create/overwrite)
    }, [user, navigate]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('http://localhost:5000/api/profiles', { role, profileData: formData }, config);
            alert('Profile updated successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error updating profile');
        }
    };

    if (!role) return <p>No role specified</p>;

    return (
        <div className='card mt-2' style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h1>{role} Profile</h1>
            <form onSubmit={onSubmit}>
                {role === 'Student' && (
                    <>
                        <div className='form-group'>
                            <label>Course</label>
                            <input type="text" name="course" className="form-control" onChange={onChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Year</label>
                            <input type="text" name="year" className="form-control" onChange={onChange} required />
                        </div>
                    </>
                )}

                {role === 'Teacher' && (
                    <>
                        <div className='form-group'>
                            <label>Department</label>
                            <input type="text" name="department" className="form-control" onChange={onChange} required />
                        </div>
                        <div className='form-group'>
                            <label>Subject</label>
                            <input type="text" name="subject" className="form-control" onChange={onChange} required />
                        </div>
                    </>
                )}

                <div className='form-group'>
                    <button type='submit' className='btn'>Save Profile</button>
                </div>
            </form>
        </div>
    );
}

export default ProfileForm;
