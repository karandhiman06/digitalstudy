import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            alert(message); // Could implement prettier toast later
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

        const userData = {
            email,
            password,
        };

        dispatch(login(userData));
    };

    if (isLoading) {
        return <div className="auth-page">Loading...</div>;
    }

    return (
        <div className='auth-page'>
            <div className='card'>
                <section>
                    <h1>Login</h1>
                    <p className="text-center">Login to your account</p>
                </section>

                <section className='form'>
                    <form onSubmit={onSubmit}>
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
                            <button type='submit' className='btn btn-block'>
                                Submit
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-2">
                        New here? <Link to="/register" className="link">Sign Up</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Login;
