import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { login, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            console.log('Response received:', response.status);
            const data = await response.json();
            
            if (!response.ok) {
                setError(data.message || 'Login failed');
            } else {
                await login();
                
                const authCheck = await fetch('http://localhost:3000/api/auth/check', {
                    credentials: 'include'
                });
                console.log('Auth check status:', authCheck.status);
                
                if (authCheck.ok) {
                    navigate('/dashboard', { replace: true });
                } else {
                    setError('Authentication verification failed');
                }
            }
        } catch (err: any) {
            console.error('Detailed error:', err);
            setError('Authentication service unavailable. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex-column m-8 p-5 bg-slate-800">
            <h3 className="text-xl font-bold mb-4">LogIn</h3>
            {error && <div className="text-red-500 p-2 flex">{error}</div>}
            <input 
                type="email"
                id="email"
                required
                placeholder="Email"
                className="w-full bg-slate-600 m-2 p-2" 
                onChange={handleEmailChange} 
            />
            <input 
                type="password"
                id="password"
                required
                placeholder="Mot de passe"
                className="w-full bg-slate-600 m-2 p-2" 
                onChange={handlePasswordChange} 
            />
            <Button type="submit">LogIn</Button>
        </form>
    );
}

export default Login;



