import React, { useEffect, useState } from 'react'
import Style from './TravelStories.module.css'
import axios from 'axios'
import useStoryContext from '../../../customhooks/useStoryContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export default function TravelStories() {

    const [noTravelStories, setNoTravelStories] = useState(true)
    const [allTravelStories, setAllTravelStories] = useState([])
    const [travelstories, setTravelStories] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [currIndex, setCurrIndex] = useState(0)
    // const [userId, setUserId] = useState();


    const { story, setStory, userId, likeCount, login, setViewStory, setAddStory, setStories, setIsEditStory, setStoryId } = useStoryContext()

    const STORY_URL = 'https://swip-story-ux7p.onrender.com/api/get-story';

    const TRAVEL_STORIES_URL = 'https://swip-story-ux7p.onrender.com/api/travel-stories';

    useEffect(() => {

        getTravelStories();

    }, [likeCount, login])



    const flattenArray = (array) => {
        return array.flatMap(obj => {
            let storiesArray = obj?.stories || [];
            return storiesArray.map(story => ({
                storyDocId: obj._id,
                userId: obj.userId,
                ...story
            }));
        });
    };

    const getStory = async (storyId) => {
        axios.get(STORY_URL, { params: { storyId } }).then((response) => {

            if (response?.data?.success) {
                const stories = response?.data?.story?.stories || [{}]
                setStories(stories)
                const id = response?.data?.story?._id;
                setStoryId(id)
            }
        }, (error) => {
            console.log("error is", error)
        })
    }


    const getTravelStories = async () => {
        axios.get(TRAVEL_STORIES_URL).then((response) => {

            let travelStories;
            if (response?.data?.success) {
                travelStories = response.data.stories;
            }
            if (travelStories.length > 0) {
                const storiesArray = flattenArray(travelStories)

                setAllTravelStories(storiesArray)
                setTravelStories(storiesArray?.slice(currIndex, currIndex + 4))
                setCurrIndex(4)
                setNoTravelStories(false)
            } else {
                setNoTravelStories(true)
                setHasMore(false)
            }
            if (travelStories.length > 4) {
                setHasMore(true)
            }


        }, (error) => {
            console.log("error while fetching", error)
        })
    }

    const seeMore = () => {
        const newIndex = currIndex + 4
        const newStories = allTravelStories?.slice(currIndex, currIndex + 4);
        setTravelStories([...travelstories, ...newStories]);
        setCurrIndex(newIndex);

        if (newIndex >= allTravelStories.length) {
            setHasMore(false);
        }

        console.log('uf', travelstories)
    }

    return (
        <div>
            <div className={Style.travelStories}>
                <div className={Style.headingContainer}>
                    <div className={Style.heading}>Top Stories About Travel</div>
                </div>
                <div className={Style.stories}>
                    {travelstories?.map((item, index) => (
                        <div className={Style.storyContainer}>
                            <div key={index} className={Style.main} onClick={() => {
                                const modifiedItem = { ...item, storyId: item._id };
                                delete modifiedItem._id;
                                setStory([modifiedItem]);
                                setViewStory(true)

                            }} style={{ backgroundImage: `url(${item?.image})` }}>
                                <div className={Style.content}>
                                    <div className={Style.contentHeader}>This is about {item?.title}</div>
                                    <div className={Style.contentDescription}>{item?.description}
                                    </div>
                                </div>
                            </div>
                            {
                                item.userId == userId && <div className={Style.edit} onClick={() => {
                                    getStory(item.storyDocId)
                                    setIsEditStory(true)
                                    setAddStory(true)
                                }}>
                                    <button><FontAwesomeIcon icon={faPenToSquare} /> Edit</button>
                                </div>
                            }
                        </div>
                    ))}

                </div>
                {noTravelStories && <div className={Style.no_stories}>
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
