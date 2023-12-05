import React, { useContext, useEffect, useState } from 'react'
import Style from './bookmarks.module.css'
import axios from 'axios'
import useStoryContext from '../../customhooks/useStoryContext'
import { useMediaQuery } from 'react-responsive'

export default function Bookmarks() {
    const [noStories, setNoStories] = useState(true)
    const [allBookMarkStories, setAllBookMarkStories] = useState([])
    const [bookmarkstories, setBookMarkStories] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [currIndex, setCurrIndex] = useState(0);

    const isMobile = useMediaQuery({ query: '(max-width: 800px)' })



    const { story, setStory, userId, login, token, likeCount, setLikeCount, viewStory, setViewStory, setAddStory, setStories, likestory, setLikeStory, setIsEditStory, setStoryId } = useStoryContext()

    const BOOKMARK_STORIES_URL = 'https://swip-story-ux7p.onrender.com/api/getbookmarks';


    useEffect(() => {
        getBookMarkStories()
    }, [])

    const getBookMarkStories = async () => {
        const headers = {
            token: token
        }
        const id = localStorage.getItem("userId");
        axios.get(BOOKMARK_STORIES_URL, { params: { userId: id } }, { headers }).then((response) => {
            console.log("bookmark res", response)

            if (response?.data?.success) {


                let bookmarkStories = response.data.bookmarks;
                if (bookmarkStories.length > 0) {

                    setAllBookMarkStories(bookmarkStories)
                    setBookMarkStories(bookmarkStories?.slice(currIndex, currIndex + 4))
                    setCurrIndex(4)
                    setNoStories(false)
                } else {
                    setNoStories(true)
                    setHasMore(false)
                }
                if (bookmarkStories.length > 4) {
                    setHasMore(true)
                }
            }
        }, (error) => {
            console.log("error while fetching", error)
        })
    }

    const seeMore = () => {
        const newIndex = currIndex + 4
        const newStories = allBookMarkStories?.slice(currIndex, currIndex + 4);
        setBookMarkStories([...bookmarkstories, ...newStories]);
        setCurrIndex(newIndex);

        if (newIndex >= allBookMarkStories.length) {
            setHasMore(false);
        }
    }
    return (
        <div className={Style.bookmarks}>

            <div>
                <div className={Style.foodStories}>
                    <div className={Style.headingContainer}>
                        <div className={Style.heading}>Bookmarks</div>
                    </div>
                    <div className={Style.stories}>
                        {bookmarkstories?.map((item, index) => (
                            <div className={Style.storyContainer}>
                                <div key={index} className={Style.main} onClick={() => {
                                    const modifiedItem = { ...item, storyId: item._id };
                                    delete modifiedItem._id;
                                    setStory([modifiedItem]);
                                    setViewStory(true)
                                    console.log("clicked story is", modifiedItem)
                                }} style={{ backgroundImage: `url(${item?.image})` }}>
                                    <div className={Style.content}>
                                        <div className={Style.contentHeader}>This is about {item?.title}</div>
                                        <div className={Style.contentDescription}>{item?.description}
                                        </div>
                                    </div>


                                </div>

                            </div>
                        ))}

                    </div>
                    {
                        noStories && <div className={Style.no_stories}>
                            <div>No Stories Available</div>
                        </div>
                    }
                    {
                        hasMore && <div className={Style.seeMore}>
                            <div>
                                <button onClick={seeMore}>See more</button>
                            </div>
                        </div>
                    }

                </div >

            </div>
        </div>
    )
}
