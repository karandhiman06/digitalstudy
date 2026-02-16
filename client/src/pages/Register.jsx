import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, password, confirmPassword } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            alert(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
        } else {
            const userData = {
                name,
                email,
                password,
            };

            dispatch(register(userData));
        }
    };

    if (isLoading) {
        return <div className="auth-page">Loading...</div>;
    }

    return (
        <div className='auth-page'>
            <div className='card'>
                <section>
                    <h1>Register</h1>
                    <p className="text-center">Create an account</p>
                </section>

                <section className='form'>
                    <form onSubmit={onSubmit}>
                        <div className='form-group'>
                            <input
                                type='text'
                                className='form-control'
                                id='name'
                                name='name'
                                value={name}
                                placeholder='Enter your name'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <input
                                type='email'
                                className='form-control'
                                id='email'
                                name='email'
                                value={email}
                                placeholder='Enter your email'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <input
                                type='password'
                                className='form-control'
                                id='password'
                                name='password'
                                value={password}
                                placeholder='Enter password'
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <input
                                type='password'
                                className='form-control'
                                id='confirmPassword'
                                name='confirmPassword'
                                value={confirmPassword}
                                placeholder='Confirm password'
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <button type='submit' className='btn btn-block'>
                                Submit
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-2">
                        Already have an account? <Link to="/login" className="link">Login</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Register;
