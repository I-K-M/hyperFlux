import { useContext, ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

const Register = () => {
const [email, setEmail] = useState<string>('');
const [password, setPassword] = useState<string>('');
const [error, setError] = useState<string>('');
const { login } = useContext(AuthContext);
const navigate = useNavigate();

const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    console.log(email)
}
const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    console.log(password)
}
const handleSubmit = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          // Handle error response from the backend
          setError(data.message || 'Sign up failed');
        } else {
          // Handle successful login (e.g., store token, redirect, etc.)
          alert('Sign up successful!');
          login();
          navigate('/dashboard');
        }
      } catch (err: any) {
        setError('An error occurred: ' + err.message);
      }
    };
return (
        <form onSubmit={handleSubmit} className="flex-column m-8 p-5 bg-slate-800">
            <h3 className=" ">SignUp</h3>
            {error && <div className="text-red-500 p-2 flex">{error}</div>}
            <input 
            type="email"
            id="email"
            required
            placeholder="Email"
            className="w-full bg-slate-600 m-2 p-2" 
            onChange={handleEmailChange} />
            <input 
            type="password"
            id="password"
            required
            placeholder="Password"
            className="w-full bg-slate-600 m-2 p-2" 
            onChange={handlePasswordChange} />
            <Button type="submit">Submit</Button>
        </form>
        )
    }
export default Register;



