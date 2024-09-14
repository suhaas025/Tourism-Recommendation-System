import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import "./header.css";

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <div class='navbar'>
            {
                userLoggedIn
                    ?
                    <>
                        <button class = "navbuttons" onClick={() => { doSignOut().then(() => { navigate('/login') }) }}>Logout</button>
                        <button class = "navbuttons" onClick={() => { navigate('/tour')  }} >Trip Planning</button>
                        <button class = "navbuttons" onClick={() => { navigate('/profile')  }} >Profile</button>
                    </>
                    :
                    <>
                        {/* <button class = "navbuttons" onclick={() => { navigate('/login')  }}>Login</button>
                        <button class = "navbuttons" onClick={() => { navigate('/register')  }} >Register New Account</button>
                        <Link to={'/login'}>Login</Link>
                        <Link to={'/register'}>Register New Account</Link> */}
                    </>
            }

        </div>
    );
}

export default Header