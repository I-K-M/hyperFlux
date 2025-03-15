import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Login = () => {
const [email, setEmail] = useState<string>('');
const [error, setError] = useState<string>('');
const navigate = useNavigate();

const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value)
    console.log(email)
}
const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch('http://localhost:3000/api/auth/password-reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) {
          // Handle error response from the backend
          setError(data.message || 'Login failed');
        } else {

          console.log('Login successful!');
          navigate('/');
        }
      } catch (err: any) {
        setError('An error occurred: ' + err.message);
      }
    };
return (
        <form onSubmit={handleSubmit} className="flex-column m-8 p-5 bg-slate-800">
            <h3 className="m-4">Reset Your Password</h3>
            <p className="text-sm">Enter your email to reset your password</p>
            {error && <div className="text-red-500 p-2 flex">{error}</div>}
            <input 
            type="email"
            id="email"
            required
            placeholder="Email"
            className="w-full bg-slate-600 m-2 p-2" 
            onChange={handleEmailChange} />
            <Button type="submit">Submit</Button>
        </form>
        )
    }
export default Login;



