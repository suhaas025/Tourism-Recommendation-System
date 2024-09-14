import React, {useState} from 'react';
import { auth } from '../../../firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'

const Change = () => {

  const { userLoggedIn } = useAuth()

  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  const [email, setEmail] = useState('');

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [infoMsg, setInfoMsg] = useState('');

  const handleLogin=(e)=>{
    e.preventDefault();
    setIsSigningIn(true)
    setLoginLoading(true);
    sendPasswordResetEmail(auth, email,{
        // this is the URL that we will redirect back to after clicking on the link in mailbox
        url: 'http://localhost:3000/login',
        handleCodeInApp: true,
      }).then(()=>{
      localStorage.setItem('email', email);
      setLoginLoading(false);
      setLoginError('');
      setInfoMsg('We have sent you an email with a link to sign in');
    }).catch(err=>{
      setLoginLoading(false);
      setLoginError(err.message);
    })
  }

  return (
    <div>

            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Forgot Password</h3>
                        </div>
                    </div>
                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>


                    
                        
                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isSigningIn ? 'Sent' : 'Send Verification Link'}
                        </button>
                    </form>
                    
                </div>
            </main>
        </div>
  )
}

export default Change