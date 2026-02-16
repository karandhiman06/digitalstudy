import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createForm, resetForms } from '../features/form/formSlice';
import { getUsers } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

function FormBuilder() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSuccess, isError, message } = useSelector((state) => state.forms);
    const { users } = useSelector((state) => state.user);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', questionType: 'text', options: [] }]);
    const [assignedTo, setAssignedTo] = useState([]);

    useEffect(() => {
        dispatch(getUsers()); // To fetch students for assignment
        return () => {
            dispatch(resetForms());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isSuccess) {
            alert('Form Created Successfully!');
            navigate('/');
        }
    }, [isSuccess, navigate]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', questionType: 'text', options: [] }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const toggleStudent = (id) => {
        if (assignedTo.includes(id)) {
            setAssignedTo(assignedTo.filter(sid => sid !== id));
        } else {
            setAssignedTo([...assignedTo, id]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createForm({
            title,
            description,
            questions,
            assignedTo
        }));
    };

    const students = users.filter(u => u.roles.some(r => r.role === 'Student' && r.status === 'Approved'));

    return (
        <div className='card mt-2' style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <h2>Create New Form</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Form Title</label>
                    <input className='form-control' value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className='form-group'>
                    <label>Description</label>
                    <textarea className='form-control' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />

                <h3>Questions</h3>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                        <div className='form-group'>
                            <input
                                className='form-control'
                                placeholder={`Question ${qIndex + 1}`}
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <select
                                className='form-control'
                                value={q.questionType}
                                onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                            >
                                <option value="text">Text Answer</option>
                                <option value="multiple-choice">Multiple Choice</option>
                            </select>
                        </div>
                    </div>
                ))}
                <button type="button" className='btn' onClick={handleAddQuestion} style={{ background: 'var(--surface-hover)', marginBottom: '1rem' }}>+ Add Question</button>

                <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />

                <h3>Assign To Students</h3>
                <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
                    {students.map(s => (
                        <div key={s._id} style={{ marginBottom: '0.5rem' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={assignedTo.includes(s._id)}
                                    onChange={() => toggleStudent(s._id)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                {s.name} ({s.email})
                            </label>
                        </div>
                    ))}
                    {students.length === 0 && <p>No approved students found.</p>}
                </div>

                <button type="submit" className='btn mt-2'>Create & Assign Form</button>
            </form>
        </div>
    );
}

export default FormBuilder;
