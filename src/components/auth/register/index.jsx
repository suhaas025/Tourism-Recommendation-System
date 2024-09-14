import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import { React,useState, useEffect } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { auth } from '../../../firebase/firebase';
import "./register.css"

const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [number, setNumber] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isRegistering && password==confirmPassword) {
            try{
                setIsRegistering(true)
                await doCreateUserWithEmailAndPassword(email, password)
                const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
                    if (user) {
                      // User is signed in, create a profile entry in the database
                      createUserProfile(user.email,number);
                    } 
                  });
                return () => unregisterAuthObserver();
            }
            catch(error){
                alert(error)
                setIsRegistering(false)
            }
            
          
        }
        else{
            setErrorMessage("Passwords don't match")
        }
    }
    const createUserProfile = async (email,number) => {
        try {
          const database = getDatabase();
          const profileRef = ref(database, 'Users');
          const newUserProfile = {
            Name: '',
            Age: '',
            Email: email,
            profilePhotoURL:'',
            Number: number
          };
          await push(profileRef, newUserProfile);
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
    };
    
    return (
        <div>
            <div class="headerpic" ></div>
            {userLoggedIn && (<Navigate to={'/tour'} replace={true} />)}
            

            <main className="w-full h-screen flex self-center place-content-center place-items-center cont">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl box">
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Create a New Account</h3>
                        </div>

                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
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
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label class = "conf">
                                Confirm Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Phone Number
                            </label>
                            <input
                                disabled={isRegistering}
                                type="text"
                                required
                                value={number} onChange={(e) => { setNumber(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-sm text-center">
                            Already have an account? {'   '}
                            <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Register