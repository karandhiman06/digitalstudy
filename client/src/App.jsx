import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileForm from './pages/ProfileForm';
import FormBuilder from './pages/FormBuilder';
import StudentForms from './pages/StudentForms';
import TakeForm from './pages/TakeForm';

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={<ProfileForm />} />
            <Route path='/create-form' element={<FormBuilder />} />
            <Route path='/student-forms' element={<StudentForms />} />
            <Route path='/take-form/:id' element={<TakeForm />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
