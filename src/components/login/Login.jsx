import React, { useEffect, useState } from 'react'
import Style from './login.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import useStoryContext from '../../customhooks/useStoryContext'


export default function Login() {

    const URL = 'https://swip-story-ux7p.onrender.com/api/login'

    const { openLogin, setOpenLogin, setUserId, setToken, user, setUser, setLogin } = useStoryContext()

    const [showPassword, setShowPassword] = useState(false)
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const userNameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,}$/

    const loginUser = async (username, password) => {
        axios.post(URL, { username, password }).then(
            (response) => {

                if (response?.data?.success) {
                    const userDetails = response?.data?.user;
                    console.log("user details", userDetails)
                    localStorage.setItem("username", userDetails.username);
                    localStorage.setItem("userId", userDetails.userId);
                    localStorage.setItem("token", userDetails.token)
                    setUser(userDetails)
                    setToken(userDetails.token);
                    setUserId(userDetails.userId)
                    setError('')
                    setLogin(true)
                    setOpenLogin(false)
                } else {
                    setError("something went wrong")
                }
            }, (error) => {

                setError(error?.response?.data?.message)
            }
        )
    }

    const login = (e) => {
        e.preventDefault()

        if (userName.length == 0 || password.length == 0) {
            setError('All fields are required!')
        } else if (userName.length < 4 || password.length < 5) {
            setError('Invalid credentials')
        } else if (!userNameRegex.test(userName)) {
            setError('Invalid credentials')
        } else {
            setError('');
            loginUser(userName, password)
        }


    }

    return (
        <div className={Style.overlay}>
            <div className={Style.outerBox}>
                <div className={Style.main}>
                    <div className={Style.exit} onClick={() => {
                        setOpenLogin(false)
                    }} >
                        <span class="material-symbols-outlined">
                            close
                        </span>
                    </div>
                    <div className={Style.header}>Login to SwipTory</div>
                    <div>
                        <form onSubmit={login}>
                            <div className={Style.field}>
                                <div className={Style.label}>Username</div>
                                <div className={Style.inputContainer}>
                                    <input type='text' placeholder='Enter username' onChange={(e) => {
                                        setUserName(e.target.value)
                                    }} />
                                </div>
                            </div>
                            <div className={Style.field}>
                                <div className={Style.label}>Password</div>
                                <div className={Style.passwordContainer}>
                                    <input type={showPassword ? 'text' : 'password'} value={password} placeholder='Enter password' onChange={(e) => {
                                        setPassword(e.target.value)
                                    }} />
                                    <span onClick={() => {
                                        setShowPassword(!showPassword)
                                    }}><FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /></span>
                                </div>
                            </div>
                            <div className={Style.errorContainer}>
                                <p className={Style.error}>{error}</p>
                            </div>
                            <div className={Style.login}><button onClick={login}>Login</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}
