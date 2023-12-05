import React, { useEffect, useState } from 'react'
import Style from './YourStories.module.css'
import axios from 'axios'
import useStoryContext from '../../../customhooks/useStoryContext';

export default function YourStories() {

    const [noStories, setNoStories] = useState(true);
    const [allYourStories, setAllYourStories] = useState([]);
    const [yourstories, setYourStories] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [currIndex, setCurrIndex] = useState(0);




    const { story, user, token, userId, setStory, setViewStory, login, likeCount, setAddStory, setStories, setIsEditStory, setStoryId } = useStoryContext()


    const YOUR_STORIES_URL = 'https://swip-story-ux7p.onrender.com/api/your-stories';

    useEffect(() => {
        getYourStories(userId);
        console.log("token in ur stor ", token)
        console.log("useeffectttttttttt your storieess", userId)

    }, [login, likeCount])





    const getYourStories = async (userId) => {

        axios.get(YOUR_STORIES_URL, { params: { userId: userId } }).then((response) => {

            let yourStories;
            let storiesArray;
            console.log("your stories ........", response)
            if (response?.data?.success) {
                const data = response?.data?.stories;
                yourStories = data.map(item => {
                    const { userId, _id: storyDocId, stories } = item;
                    const updatedStories = stories.map(({ _id, ...story }) => ({ ...story, userId, storyDocId, storyId: _id }));

                    return { userId, storyDocId, stories: updatedStories };
                });

            }
            if (yourStories?.length > 0) {

                setAllYourStories(yourStories)
                setYourStories(yourStories?.slice(currIndex, currIndex + 4))
                setCurrIndex(4)
                setNoStories(false)
            } else {
                setNoStories(true)
                setHasMore(false)
            }

            if (storiesArray?.length > 4) {
                setHasMore(true)

            }


        }, (error) => {
            console.log("error while fetching", error, error?.message)
            console.log("your storiessssssss erorrrrrrrrr", error)
        })
    }

    const seeMore = () => {
        const newIndex = currIndex + 4
        const newStories = allYourStories?.slice(currIndex, currIndex + 4);
        setYourStories([...yourstories, ...newStories]);
        setCurrIndex(newIndex);

        if (newIndex >= allYourStories?.length) {
            setHasMore(false);
        }


    }


    return (
        <div>
            <div className={Style.yourStories}>
                <div className={Style.headingContainer}>
                    <div className={Style.heading}>Your Stories</div>
                </div>
                <div className={Style.stories}>
                    {yourstories?.map((item, index) => (
                        <div className={Style.storyContainer}>
                            <div key={index} className={Style.main} onClick={() => {
                                setStory(item.stories)
                                setViewStory(true)
                            }} style={{ backgroundImage: `url(${item?.stories[index]?.image})` }}>
                                <div className={Style.content}>
                                    <div className={Style.contentHeader}>This is about {item[index]?.title}</div>
                                    <div className={Style.contentDescription}>{item[index]?.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                {noStories && <div className={Style.no_stories}>
                    <div>No Stories Available</div>
                </div>}
                {hasMore && <div className={Style.seeMore}>
                    <div>
                        <button onClick={seeMore}>See more</button>
                    </div>
                </div>}

            </div >
        </div>
    )
}
