import React, { useEffect, useState } from 'react'
import Style from './header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faBars } from '@fortawesome/free-solid-svg-icons'
import usericon from '../../../assets/icons/usericon.png'
import useStoryContext from '../../../customhooks/useStoryContext'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router'

export default function Header() {
    const [home, setHome] = useState(false)
    const { addStory, setAddStory, setToken, setUserId, login, setbookmark, showBookmarks, setLikeStory, setShowBookmarks, setLogin, user, setUser, openLogin, setOpenLogin, openRegister, setOpenRegister } = useStoryContext();

    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("username")


    useEffect(() => {
        const token = localStorage.getItem("token");

        const userId = localStorage.getItem("userId");
        const name = localStorage.getItem("username")
        if (token) {
            const user = jwtDecode(token);
           
            if (user) {
                setLogin(true)
                setToken(token)
                setUserId(userId)
                setUser({ name, userId, token })
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
        setLikeStory(false)
        setbookmark(false)
        setUser({})
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("username")
    }
    return (
        <div className={Style.header}>
            <div className={Style.leftBlock}>
                <div className={Style.appName} onClick={() => { setShowBookmarks(false) }}>
                    SwipTory
                </div>
            </div>
            <div className={Style.rightBlock}>
                {!login && <div className={Style.userLogin}>
                    <button className={Style.register} onClick={() => {
                        setOpenRegister(true)
                        setOpenLogin(false)
                        setHome(!home)
                    }}>Register Now</button>
                    <button className={Style.login} onClick={() => {
                        setOpenLogin(true)
                        setOpenRegister(false)
                        setHome(!home)
                    }}>Sign In</button>
                </div>}

                {login && <div className={Style.additionalDetails}>
                    <div className={Style.bookmarksContainer}>
                        <button className={Style.bookmarks} onClick={() => {
                            if (login) {
                                setShowBookmarks(true)
                            } else {
                                alert("please login to see bookmarks");

                            }
                        }}><FontAwesomeIcon icon={faBookmark} style={{ color: "#f7f7f8", marginRight: '3px' }} />Bookmarks</button>
                        <button className={Style.addStory} onClick={() => {
                            setShowBookmarks(false)
                            setAddStory(!addStory)

                        }}>Add story</button>
                    </div>
                    <div className={Style.userIconContainer}>
                        <img alt='usericon' src={usericon} />
                    </div>
                    <div className={Style.homeIconContainer}>
                        <FontAwesomeIcon icon={faBars} className={Style.home} onClick={() => {
                            setHome(!home)
                        }} />
                        {home && <div className={Style.dropdown}>
                            <div className={Style.userName}>{user.name}</div>
                            <div><button className={Style.logout} onClick={logout}>logout</button></div>
                        </div>}
                    </div>

                </div>}
            </div>
        </div>
    )
}
