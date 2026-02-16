import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { submitForm } from '../features/form/formSlice';
import axios from 'axios'; // We might need direct axios for fetching single form if not in store

function TakeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({}); // Map questionId -> answer

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const res = await axios.get(`http://localhost:5000/api/forms/${id}`, config);
                setForm(res.data);
            } catch (error) {
                console.error(error);
                alert('Error loading form');
                navigate('/');
            }
        };

        if (user && id) {
            fetchForm();
        }
    }, [user, id, navigate]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert answers map to array format expected by backend
        const formattedAnswers = Object.keys(answers).map(qId => ({
            questionId: qId,
            answer: answers[qId]
        }));

        try {
            await dispatch(submitForm({ formId: id, answers: formattedAnswers })).unwrap();
            alert('Form Submitted Successfully!');
            navigate('/student-forms');
        } catch (err) {
            alert('Submission Failed: ' + err);
        }
    };

    if (!form) return <div>Loading Form...</div>;

    return (
        <div className='card mt-2' style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <h2>{form.title}</h2>
            <p>{form.description}</p>
            <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />

            <form onSubmit={handleSubmit}>
                {form.questions.map((q) => (
                    <div key={q._id} className='form-group' style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{q.questionText}</label>

                        {q.questionType === 'text' ? (
                            <input
                                className='form-control'
                                required
                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                            />
                        ) : (
                            <select
                                className='form-control'
                                required
                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                defaultValue=""
                            >
                                <option value="" disabled>Select an option</option>
                                {q.options.map((opt, idx) => (
                                    <option key={idx} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
                <button type="submit" className='btn'>Submit Answers</button>
            </form>
        </div>
    );
}

export default TakeForm;
