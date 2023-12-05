import React, { useState, useEffect } from 'react'
import Style from './header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faBookmark, faBars, faL } from '@fortawesome/free-solid-svg-icons'
import usericon from '../../../assets/icons/usericon.png'
import useStoryContext from '../../../customhooks/useStoryContext'
import { jwtDecode } from "jwt-decode";


export default function SmallScreenHeader() {
    const [home, setHome] = useState(false);
    const { setAddStory, login, setToken, setUserId, setLogin, user, setLikeStory, setbookmark, showBookmarks, setShowBookmarks, setUser, setShowYourStories, setOpenRegister, setOpenLogin } = useStoryContext()


    useEffect(() => {
        const token = localStorage.getItem("token");

        const userId = localStorage.getItem("userId");
        const name = localStorage.getItem("username")
        if (token) {
            const user = jwtDecode(token);
          
            if (user) {
                setLogin(true)
                setUser({ name, userId, token })
                setToken(token)
                setUserId(userId)
            } else {
                setLogin(false);
                setToken('')
                setUserId('')

                setUser({})
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
                localStorage.removeItem("username")
            }
        } else {
            setLogin(false);
            setUser({})
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("username")
        }

    }, [login])

    const logout = () => {
        setLogin(false)
        setUser({})
        setLikeStory(false)
        setbookmark(false)
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("username")
    }
    return (
        <div className={Style.main}>
            <div className={Style.leftBlock}>
                <div className={Style.appName} onClick={() => {
                    setShowBookmarks(false);
                    setShowYourStories(false)
                }}>SwipTory</div>
            </div>
            <div className={Style.rightBlock}>
                <FontAwesomeIcon icon={faBars} className={Style.home} onClick={() => {
                    setHome(!home)
                }} />
            </div>
            {home && <div className={Style.dropDown}>
                <div className={Style.exit} >
                    <span class="material-symbols-outlined" onClick={() => {
                        setHome(!home)
                    }}>
                        close
                    </span>
                </div>

                {!login && <div className={Style.loginContainer}>
                    <div>
                        <div><button className={Style.login} onClick={() => {
                            setOpenRegister(false)
                            setOpenLogin(true)
                            setHome(!home)
                        }}>Login</button></div>
                        <div><button className={Style.register} onClick={() => {
                            setOpenLogin(false)
                            setOpenRegister(true)
                            setHome(!home)
                        }}>Register</button></div>
                    </div>
                </div>}

                {login &&
                    <div>
                        <div className={Style.loggedInUserDetails}>
                            <img src={usericon} />
                            <span className={Style.userName}>{user.name}</span>
                        </div>
                        <div className={Style.homeItems}>
                            <div>
                                <div><button className={Style.login} onClick={() => {
                                    setShowBookmarks(false);
                                    setShowYourStories(true);
                                    setHome(!home)
                                }}>Your Story</button></div>

                                <div><button className={Style.register} onClick={() => {
                                    setAddStory(true);
                                    setShowBookmarks(false)
                                    setHome(!home)
                                }}>Add Story</button></div>

                                <div><button className={Style.register} onClick={() => {
                                    setShowBookmarks(true);
                                    setHome(!home)
                                }}><FontAwesomeIcon icon={faBookmark} style={{ color: "#f7f7f8", marginRight: '3px' }} />Bookmarks</button></div>

                                <div><button className={Style.register} onClick={() => {
                                    logout();
                                    setHome(!home)
                                }}>Logout</button></div>
                            </div>
                        </div>
                    </div>}
            </div>}

        </div >
    )
}
