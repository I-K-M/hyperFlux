import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import ChatBot from '../components/ChatBot';
import MyCalendar from '../components/Calendar';

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [error, setError] = useState<string>('');
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

 const logOutOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault();
     setError('');
 
     try {
         const response = await fetch('http://localhost:3000/api/auth/logout', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
            credentials: 'include'
         });
         const data = await response.json();
         if (!response.ok) {
           // Handle error response from the backend
           setError(data.message || 'Login failed');
         } else {
           // Handle successful login (e.g., store token, redirect, etc.)
           logout();
           console.log('Logout successful!');
           navigate('/');
         }
       } catch (err: any) {
         setError('An error occurred: ' + err.message);
       }
     };
  return (
    <>
    <div className='w-full flex flex-row place-content-between'>
    <div>
    <Button onClick={logOutOnClick}>LogOut</Button>
    </div>
    <div>
    {isDarkTheme ? 
    <Button onClick={toggleTheme}>☀️</Button>
    :
    <Button onClick={toggleTheme}>🌑</Button>
    }
    
    </div>
    </div>
    
    
    {error && <div className="text-red-500 p-2 flex">{error}</div>}
      <h1 className='p-8 font-bold text-5xl'>
        WELCOME ON YOUR GREAT DASHBOARD!
      </h1>
      <ChatBot/>
      <MyCalendar/>
    </>
  )
}

export default Dashboard
