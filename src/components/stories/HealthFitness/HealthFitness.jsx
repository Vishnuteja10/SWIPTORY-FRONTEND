import React, { useEffect, useState } from 'react'
import Style from './HealthFitness.module.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import useStoryContext from '../../../customhooks/useStoryContext'

export default function HealthFitness() {

    const [noHealthStories, setNoHealthStories] = useState(true)
    const [allHealthStories, setAllHealthStories] = useState([])
    const [healthstories, setHealthStories] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [currIndex, setCurrIndex] = useState(0)


    const { story, likeCount, login, userId, setStory, setViewStory, setAddStory, setStories, setIsEditStory, setStoryId } = useStoryContext()



    const HEALTH_STORIES_URL = 'https://swip-story-ux7p.onrender.com/api/health-fitness-stories';

    const STORY_URL = 'https://swip-story-ux7p.onrender.com/api/get-story';

    useEffect(() => {
        getHealthFitnessStories();
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



    const getHealthFitnessStories = async () => {
        axios.get(HEALTH_STORIES_URL).then((response) => {

            let healthStories;
            if (response?.data?.success) {
                healthStories = response.data.stories;
            }
            if (healthStories.length > 0) {
                const storiesArray = flattenArray(healthStories)

                setAllHealthStories(storiesArray)
                setHealthStories(storiesArray?.slice(currIndex, currIndex + 4))
                setCurrIndex(4)
                setNoHealthStories(false)
            } else {
                setNoHealthStories(true)
                setHasMore(false)
            }
            if (allHealthStories.length > 4) {
                setHasMore(true)
            }


        }, (error) => {
            console.log("error while fetching", error)
        })
    }

    const seeMore = () => {
        const newIndex = currIndex + 4
        const newStories = allHealthStories?.slice(currIndex, currIndex + 4);
        setHealthStories([...healthstories, ...newStories]);
        setCurrIndex(newIndex);

        if (newIndex >= allHealthStories.length) {
            setHasMore(false);
        }

        console.log('uf', healthstories)
    }

    return (
        <div>
            <div className={Style.healthStories}>
                <div className={Style.headingContainer}>
                    <div className={Style.heading}>Top Stories About Health and Fitness</div>
                </div>
                <div className={Style.stories}>
                    {healthstories?.map((item, index) => (
                        <div className={Style.storyContainer}>
                            <div key={index} className={Style.main} onClick={() => {
                                const modifiedItem = { ...item, storyId: item._id };
                                delete modifiedItem._id;
                                setStory([modifiedItem]);
                                setViewStory(true)

                            }} style={{ backgroundImage: `url(${item?.img})` }}>
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
                {noHealthStories && <div className={Style.no_stories}>
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
