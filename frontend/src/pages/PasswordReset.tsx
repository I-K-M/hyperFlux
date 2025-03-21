import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';

const PasswordReset: React.FC = () => {
    const navigate = useNavigate(); 
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/password-reset-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Password reset failed');
            } else {
                setSuccess('Password reset successful');
                setTimeout(() => navigate('/'), 3000);
            }
        } catch (error) {
            setError('An error occurred: ' + error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen"> 
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
                <p className="mb-4">Enter your email to reset your password</p>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                <input 
                    type="password"
                    value={password}   
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 p-2 border"
                    required
                />
                <Button type="submit">
                    Reset Password
                </Button>
                <Button onClick={() => navigate('/')}>
                    Back to Login
                </Button>   
            </form>
        </div>
    );
};

export default PasswordReset;
