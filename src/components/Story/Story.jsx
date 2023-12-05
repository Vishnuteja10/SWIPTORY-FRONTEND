import React, { useEffect, useState } from 'react'
import Style from './Story.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faXmark, faPaperPlane, faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons'
import useStoryContext from '../../customhooks/useStoryContext'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'


export default function StoryComponent() {
    const isMobile = useMediaQuery({ query: '(max-width: 800px)' })

    const { story, bookmark, setbookmark, login, likeCount, setLikeCount, setViewStory, setOpenLogin, likestory, setLikeStory } = useStoryContext()
    const [index, setIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const [userId, setUserId] = useState()
    const [token, setToken] = useState()

    const [bookmarkStoryId, setbookmarkStoryId] = useState()
    const [shareableLink, setShareableLink] = useState('')

    const eachProgressWidth = 24 / story.length;
    const widthInc = eachProgressWidth / 5;

    const eachProgressWidthInMobile = 98 / story.length;
    const widthIncrementMobile = eachProgressWidthInMobile / 5;


    const LIKE_STORY = 'https://swip-story-ux7p.onrender.com/api/like-story';
    const DISLIKE_STORY = 'https://swip-story-ux7p.onrender.com/api/dislike-story';
    const BOOKMARK_STORY = 'https://swip-story-ux7p.onrender.com/api/addbookmark';
    const UNDO_BOOKMARK = 'https://swip-story-ux7p.onrender.com/api/removebookmark';




    const [likedStories, setLikedStories] = useState([]);
    const [bookmarkedStories, setBookmarkedStories] = useState([])
  

    useEffect(() => {
        const token = localStorage.getItem("token")
        setToken(token)
        const id = localStorage.getItem("userId");
        setUserId(id)
        setLikeCount(story[index]?.likes)
        const likedStoriesExists = localStorage.getItem('likedStories');

        if (!likedStoriesExists) {
            
            localStorage.setItem('likedStories', JSON.stringify([]));
           
        } else {
            try {
                const parsedLikedStories = JSON.parse(likedStoriesExists) || [];
                setLikedStories(parsedLikedStories);
                const currentUserLikedStories = parsedLikedStories.find(user => user.userId === userId);
                if (currentUserLikedStories) {
                    const isLiked = currentUserLikedStories?.storyIds?.includes(story[index]?.storyId);
                    setLikeStory(isLiked);
                } else {
                    const newUserLikedStories = {
                        userId: userId,
                        storyIds: []
                    };
                    setLikedStories([...parsedLikedStories, newUserLikedStories]);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }

    }, [userId, index, story]);

    useEffect(() => {
        const bookmarkExists = localStorage.getItem("bookmarkedStories");
        if (!bookmarkExists) {
            localStorage.setItem('bookmarkedStories', JSON.stringify([]));
            setBookmarkedStories([]);
        } else {
            try {
                const parsedBookmarkStories = JSON.parse(bookmarkExists) || [];
                setBookmarkedStories(parsedBookmarkStories);
                const currentUserBookmarkerdStories = parsedBookmarkStories.find(user => user.userId === userId)
                if (currentUserBookmarkerdStories) {
                    const isbookmarked = currentUserBookmarkerdStories.storyIds.includes(story[index]?.storyId)
                    setbookmark(isbookmarked)
                    if (isbookmarked) {
                        const id = story[index].storyId
                        setbookmarkStoryId(id)
                    }
                } else {
                    const newUserBookmarkedStories = {
                        userId: userId,
                        storyIds: []
                    }
                    setBookmarkedStories([...parsedBookmarkStories, newUserBookmarkedStories])
                }

            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
    }, [index, story, userId])



    // useEffect(() => {
    //     const bookmarkExists = localStorage.getItem("bookmarkedStories");
    //     if (bookmarkExists) {
    //         try {
    //             const parsedBookmarkStories = JSON.parse(bookmarkExists) || [];
    //             setBookmarkedStories(parsedBookmarkStories)
    //             const isBookmarked = parsedBookmarkStories.includes(story[index]?.storyId);
    //             if (isBookmarked) {
    //                 setbookmarkStoryId(story[index]?.storyId)
    //             }
    //             setbookmark(isBookmarked);
    //         } catch (error) {
    //             console.error('Error parsing JSON:', error);
    //         }
    //     }
    // }, [])

    useEffect(() => {

        const interval = setInterval(() => {
            if (index < story.length - 1) {
                setIndex((prev) => prev + 1)
                setProgress(0)
            } else {
                clearInterval(interval)
            }
        }, 5000)
        console.log("index in useeffect is", index)
        return () => clearInterval(interval)
    }, [index])


    useEffect(() => {
        const interval = setInterval(() => {
            if (isMobile) {
                if (progress < eachProgressWidthInMobile) {
                    setProgress((prev) => prev + widthIncrementMobile)
                } else {
                    setViewStory(false)
                    clearInterval(interval)
                }

            } else {
                if (progress < eachProgressWidth) {
                    setProgress((prev) => prev + widthInc)
                } else {
                    setViewStory(false)
                    clearInterval(interval)
                }
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [progress])

    const moveLeft = () => {
        if (index > 0) {
            setIndex((prev) => prev - 1);
            setProgress(0);
        }
    }

    const moveRight = () => {
        if (index + 1 < story.length) {
            setIndex((prev) => prev + 1);
            setProgress(0);
        }
    }

    const bookmarkStory = () => {
        setbookmark((prevbookmark) => {
            const newBookmark = !prevbookmark
            if (newBookmark) {
                addBookmark()
            } else {
                removeBookmark()
            }
            return newBookmark;
        });
    }

    // const removeBookmark = async () => {
    //     if (bookmarkedStories.includes(story[index]?.storyId)) {
    //         const updatedBookmarkedStories = bookmarkedStories.filter(id => id !== story[index]?.storyId);
    //         setBookmarkedStories(updatedBookmarkedStories);
    //         localStorage.setItem('bookmarkedStories', JSON.stringify(updatedBookmarkedStories));

    //     }
    //     axios.delete(UNDO_BOOKMARK, {
    //         data: { storyId: bookmarkStoryId },
    //     }).then((response) => {
    //         console.log("response in remove bookmark", response);
    //         if (response.data.success) {
    //             console.log("removeeeeeeeeeeeeeed bookmark");
    //             alert("bookmark removed")
    //         } else {

    //         }
    //     }, (error) => {
    //         console.log(error)

    //     })
    // }

    const updateBookmarkedStories = (newBookmarkedStories) => {
        localStorage.setItem('bookmarkedStories', JSON.stringify(newBookmarkedStories));
        setBookmarkedStories(newBookmarkedStories);
    };

    const removeBookmark = async () => {
        const headers = {
            token: token
        }
        const currentUserBookmarkerdStories = bookmarkedStories.find(user => user.userId === userId)
        const updatedBookmarkedStories = [...bookmarkedStories];

        if (currentUserBookmarkerdStories) {
            const { storyIds } = currentUserBookmarkerdStories;
            const storyId = story[index].storyId;

            if (storyIds.includes(storyId)) {
                currentUserBookmarkerdStories.storyIds = storyIds.filter(id => id !== storyId);
                updateBookmarkedStories(updatedBookmarkedStories);
            }
        }
        axios.delete(UNDO_BOOKMARK, {
            data: { storyId: bookmarkStoryId },
        }, { headers }).then((response) => {
            console.log("response in remove bookmark", response);
            if (response.data.success) {
                console.log("removeeeeeeeeeeeeeed bookmark");
                alert("bookmark removed")
            } else {

            }
        }, (error) => {
            console.log(error)

        })

    };



    // const addBookmark = async () => {
    //     if (!bookmarkedStories.includes(story[index]?.storyId)) {
    //         const updatedBookmarkedStories = [...bookmarkedStories, story[index]?.storyId];
    //         setBookmarkedStories(updatedBookmarkedStories);
    //         localStorage.setItem('bookmarkedStories', JSON.stringify(updatedBookmarkedStories));
    //     }
    //     const storyItem = story[index];
    //     axios.post(BOOKMARK_STORY, { story: storyItem }).then((response) => {
    //         console.log("response is add booook markkkkk", response)
    //         if (response?.data?.bookmark?._id) {
    //             alert("story added to bookmark")
    //             const id = response.data.bookmark.storyId;
    //             setbookmarkStoryId(id);
    //         }
    //     }, (error) => {
    //         console.log(error)
    //     })
    // }

    const addBookmark = () => {
        const headers = {
            token: token
        }
        const currentUserBookmarkerdStories = bookmarkedStories.find(user => user.userId === userId);
        const updatedBookmarkedStories = [...bookmarkedStories];
        if (currentUserBookmarkerdStories) {
            const { storyIds } = currentUserBookmarkerdStories;
            const storyId = story[index].storyId;

            if (!storyIds.includes(storyId)) {
                currentUserBookmarkerdStories.storyIds.push(storyId);
                updateBookmarkedStories(updatedBookmarkedStories)
            }
        }
        const storyItem = story[index];
        axios.post(BOOKMARK_STORY, { story: storyItem }, { headers }).then((response) => {
            console.log("response is add booook markkkkk", response)
            if (response?.data?.bookmark?._id) {
                alert("story added to bookmark")
                const id = response.data.bookmark.storyId;
                setbookmarkStoryId(id);
            }
        }, (error) => {
            console.log(error)
        })
    }

    const updateLikedStories = (newLikedStories) => {
        localStorage.setItem('likedStories', JSON.stringify(newLikedStories));
        setLikedStories(newLikedStories);
    };

    const likedStory = () => {
        const currentUserLikedStories = likedStories.find(user => user.userId === userId);
        const updatedLikedStories = [...likedStories];

        if (currentUserLikedStories) {
            const { storyIds } = currentUserLikedStories;
            const storyId = story[index]?.storyId;

            if (!storyIds.includes(storyId)) {
                currentUserLikedStories.storyIds.push(storyId);
                updateLikedStories(updatedLikedStories);
            }
        }
        const headers = {
            token: token
        }

        axios.put(LIKE_STORY, { id: story[index].storyDocId, storyId: story[index].storyId }, { headers }).then((response) => {
            console.log(response)
            if (response?.data?.success) {
                const likes = response.data.likesCount;
                setLikeCount(likes);
            }
        }, (error) => {
            console.log(error)
        })
    };

    const likeStory = () => {
        setLikeStory((prevLikeStory) => {
            const newLikeStory = !prevLikeStory;
            if (newLikeStory) {
                likedStory();
            } else {
                dislikeStory();
            }
            return newLikeStory;
        });
    };

    const dislikeStory = () => {
        const headers = {
            token: token
        }
        const currentUserLikedStories = likedStories.find(user => user.userId === userId);
        const updatedLikedStories = [...likedStories];

        if (currentUserLikedStories) {
            const { storyIds } = currentUserLikedStories;
            const storyId = story[index]?.storyId;

            if (storyIds.includes(storyId)) {
                currentUserLikedStories.storyIds = storyIds.filter(id => id !== storyId);
                updateLikedStories(updatedLikedStories);
            }
            axios.put(DISLIKE_STORY, { id: story[index].storyDocId, storyId: story[index].storyId }, { headers }).then((response) => {
                console.log(response)
                if (response?.data?.success) {
                    const likes = response.data.likesCount;
                    setLikeCount(likes);
                }
            }, (error) => {
                console.log(error)
            })
        }
    };


    // const likedStory = async () => {
    //     const updatedLikedStories = likestory ? likedStories?.filter(id => id !== story[index]?.storyId) : [...likedStories, story[index]?.storyId];
    //     localStorage.setItem('likedStories', JSON.stringify(updatedLikedStories));
    //     axios.put(LIKE_STORY, { id: story[index].storyDocId, storyId: story[index].storyId }).then((response) => {
    //         console.log(response)
    //         if (response?.data?.success) {
    //             const likes = response.data.likesCount;
    //             setLikeCount(likes);
    //         }
    //     }, (error) => {
    //         console.log(error)
    //     })
    // }

    // const dislikeStory = async () => {
    //     const updatedLikedStories = likedStories?.filter(id => id !== story[index]?.storyId);
    //     localStorage.setItem('likedStories', JSON.stringify(updatedLikedStories));

    //     axios.put(DISLIKE_STORY, { id: story[index].storyDocId, storyId: story[index].storyId }).then((response) => {
    //         console.log(response)
    //         if (response?.data?.success) {
    //             const likes = response.data.likesCount;
    //             setLikeCount(likes);
    //         }
    //     }, (error) => {
    //         console.log(error)
    //     })
    // }

    const generateSharableLink = () => {
        const id = story[index].storyDocId;
        const storyId = story[index].storyId;
        const storyindex = index;
        let isMultiple = false;
        if (story.length > 1) {
            isMultiple = true;
        }

        const Link = `${window.location.origin}/viewstory?storyId=${storyId}&storyindex=${storyindex}&id=${id}&isMultiple=${isMultiple}`;
        console.log("Linkkkkkkkkkkkkkkkkkkkkkkkk", Link)
        navigator.clipboard.writeText(Link)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Error copying to clipboard:', err);
            });
        setShareableLink(Link);

    }

    return (
        <div>
            <div className={Style.overlay}>
                <div className={Style.storyContainer}>
                    <div className={Style.story} style={{ backgroundImage: `url(${story[index]?.image})` }}>
                        <div className={Style.progressBarContainer}>
                            {story.map((item, indx) => (
                                <div key={indx} className={Style.progressBar} style={{ width: isMobile ? `${eachProgressWidthInMobile}vw` : `${eachProgressWidth}vw` }}>
                                    {index == indx &&
                                        <div key={indx} className={Style.progress} style={{ width: `${progress}vw` }}>

                                        </div>}

                                </div>
                            ))}
                        </div>
                        <div className={Style.share_exit_container}>
                            <div ><FontAwesomeIcon className={Style.exit} icon={faXmark} onClick={() => {
                                setViewStory(false)
                            }} style={{ color: "#fafafa", }} /></div>
                            <div ><FontAwesomeIcon className={Style.share} icon={faPaperPlane} onClick={() => {
                                generateSharableLink()
                            }} style={{ color: "#fafafa", }} /></div>
                        </div>

                        <div className={Style.content}>
                            <div className={Style.header}>{story[index]?.heading}</div>
                            <div className={Style.description}> {story[index]?.description} </div>
                            <div className={Style.like_bookmar_container}>
                                <div className={Style.bookmark} >
                                    <FontAwesomeIcon icon={faBookmark} onClick={() => {
                                        if (!login) {
                                            setViewStory(false)
                                            setOpenLogin(true);
                                            return
                                        }
                                        bookmarkStory()
                                    }
                                    } style={{ color: bookmark ? "#0066ff" : "#fafafa" }} /></div>
                                <div className={Style.like}>
                                    <FontAwesomeIcon icon={faHeart} onClick={() => {
                                        if (!login) {
                                            setViewStory(false)
                                            setOpenLogin(true);
                                            return
                                        }
                                        likeStory()
                                    }} style={{ color: likestory ? "#ff0000" : "#fafafa", }} />
                                    <span className={Style.likeCount}>{likeCount}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className={Style.leftArrow} onClick={moveLeft}><FontAwesomeIcon icon={faChevronLeft} style={{ color: "#ffffff", }} /></div>
                    <div className={Style.rightArrow} onClick={moveRight}><FontAwesomeIcon icon={faChevronRight} style={{ color: "#ffffff", }} /></div>
                </div>
            </div>
        </div>
    )
}
