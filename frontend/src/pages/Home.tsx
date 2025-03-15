import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GoogleAuthError } from '../types/auth'
import Login from '../components/Login';
import Register from '../components/Register'
import { AuthContext } from '../context/AuthContext';
import happyman from '../assets/happy-man.webp';
import Button from '../components/Button';
import { ThemeContext } from '../context/ThemeContext';
import PasswordReset from '../components/PasswordReset';

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [chooseRegister, setChooseRegister] = useState<boolean>(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toggleTheme, isDarkTheme } = useContext(ThemeContext);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const handleLoginSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      setToken(response.credential);
      console.log("Token set");
      login();
      navigate("/dashboard");
    } else {
      console.error("Google login failed: No credential received");
    }
  }
  const handleLoginFailure = () => {
    console.error("Google OAuth error");
  }
  const loginOrRegistration = () => {
    setChooseRegister(prevChooseRegister => !prevChooseRegister);
  }
  const goBackFromPasswordReset = () => {
    setShowPasswordReset(false);
    setChooseRegister(false);
  }
  return (
    <div className='w-full border-1 border-white p-2'>
    <div className='flex justify-end'>
      {isDarkTheme ? 
    <Button onClick={toggleTheme}>☀️</Button>
    :
    <Button onClick={toggleTheme}>🌑</Button>
    }
    </div>
      <div className='w-full flex flex-row '>
        <div className='w-1/2'>
        <h1 className='m-2 p-2.5 font-bold  '>
          HyperFlux
        </h1>
        <h2 className='m-8 p-2.5  '>Save time & energy managing your time, tasks, with stats and AI</h2>
        <ol className='text-left m-8 list-decimal'>
        <li>Calendar & tasks manager with timer</li>
        <li>An AI agent here to help you</li>
        <li>Stats & analytics</li>
        </ol>
        <span className='m-4 mb-8 p-2.5 text-2xl font-bold text-yellow-500'>Win time, win energy, win money!</span>
        <a href="#greatForm">
        <Button>I want to be happy in my life</Button>
        </a>
        </div>
        <div className='w-1/2 flex flex-col'>
        <img src={happyman} className='h-3/4 object-cover' alt='this freelancer is happy because he uses HyperFlux' />
        <span className='m-2 p-2.5 text-sm  '>This freelancer is happy. Do you want to be happy too?</span>
        </div>
      </div>
      <h3 id="greatForm" className='m-8 p-2.5 text-lg font-bold  '>Try Now Bro</h3>
      {showPasswordReset ?
      <div className='flex flex-col justify-self-center w-3/4 md:w-1/2 lg:w-2/3'>
        <span className='m-4 p-2.5 cursor-pointer underline hover:no-underline hover:text-slate-400'
        onClick={goBackFromPasswordReset}
        >Already have an account? Log in.</span>
      <PasswordReset />
      </div>
      : chooseRegister ? 
      (
        <div className='flex flex-col justify-self-center w-3/4 md:w-1/2 lg:w-2/3'>
          <span className='m-4 p-2.5 cursor-pointer underline hover:no-underline hover:text-slate-400'
          onClick={loginOrRegistration}
          >Already have an account? Log in.</span>
          <Register />
          <div className="flex justify-center items-center"><span className='m-8 p-2.5 text-sm cursor-pointer underline hover:no-underline hover:text-slate-400' onClick={() => setShowPasswordReset(true)}>Forgot your password?</span></div>
        </div>
        ) 
      : 
      (
      <div className='flex flex-col justify-self-center w-3/4 md:w-1/2 lg:w-2/3'>
      <span className='m-4 p-2.5 cursor-pointer underline hover:no-underline hover:text-slate-400'
      onClick={loginOrRegistration}
      >Don't have an account? Create one.</span>
      <Login />
      <div className="flex justify-center items-center"><span className='m-8 p-2.5 text-sm cursor-pointer underline hover:no-underline hover:text-slate-400' onClick={() => setShowPasswordReset(true)}>Forgot your password?</span></div>
      </div>
      )
     }
      <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginFailure}
      />
    </div>
  )
}
export default Home
