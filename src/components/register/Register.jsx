import React from 'react'
import Style from './register.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import axios from 'axios'
import useStoryContext from '../../customhooks/useStoryContext'

export default function Register() {

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [userName, setUserName] = useState('')
    const [error, setError] = useState('')

    const userNameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,}$/

    const URL = "https://swip-story-ux7p.onrender.com/api/register";

    const { openRegister, setOpenRegister, setUserId, setToken, setUser, user, setLogin } = useStoryContext()

    const registerUser = async (username, password) => {
        axios.post(URL, { username, password }).then(
            (response) => {
                console.log("register resss", response)
                if (response?.data?.success) {
                    const userDetails = response?.data?.user;

                    localStorage.setItem("username", userDetails?.username);
                    localStorage.setItem("userId", userDetails?.userId);
                    localStorage.setItem("token", userDetails?.token)
                    setUserId(userDetails.userId)
                    setToken(userDetails.token)
                    setUser(userDetails)
                    setError('')
                    setLogin(true)
                    setOpenRegister(false)
                } else {
                    setError("something went wrong")
                }
            }, (error) => {
                console.log("register errror", error)
                setError(error?.response?.data?.message)
            }
        )
    }

    const register = (e) => {
        e.preventDefault()
        if (userName.length == 0 || password.length == 0) {
            setError('All fields are required!')
        } else if (userName.length < 4) {
            setError('username length must be greater than 3')
        }
        else if (!userNameRegex.test(userName)) {
            setError('username is alphanumeric and starts with alphbet')
        } else if (password.length < 5) {
            setError('password length must be greater than 5')
        } else {
            setError('')
            registerUser(userName, password)
        }

    }

    return (
        <div className={Style.overlay}>
            <div className={Style.outerBox}>
                <div className={Style.main}>
                    <div className={Style.exit} onClick={() => {
                        setOpenRegister(false)
                    }}>
                        <span class="material-symbols-outlined">
                            close
                        </span>
                    </div>
                    <div className={Style.header}>Register to SwipTory</div>
                    <div>
                        <form onSubmit={register}>
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
                            <div className={Style.register}><button>Register</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
