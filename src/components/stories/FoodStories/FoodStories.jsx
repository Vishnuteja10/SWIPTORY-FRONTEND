import React, { useContext, useEffect, useState } from 'react'
import Style from './FoodStories.module.css'
import axios from 'axios'
import useStoryContext from '../../../customhooks/useStoryContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export default function FoodStories() {
    const [noFoodStories, setNoFoodStories] = useState(true)
    const [allFoodStories, setAllFoodStories] = useState([])
    const [foodstories, setFoodStories] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [currIndex, setCurrIndex] = useState(0);


    const { story, setStory, userId, login, likeCount, setLikeCount, setViewStory, setAddStory, setStories, likestory, setLikeStory, setIsEditStory, setStoryId } = useStoryContext()

    const FOOD_STORIES_URL = 'https://swip-story-ux7p.onrender.com/api/food-stories';

    const STORY_URL = 'https://swip-story-ux7p.onrender.com/api/get-story';



    useEffect(() => {
        getFoodStories()
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

    const getFoodStories = async () => {
        axios.get(FOOD_STORIES_URL).then((response) => {

            let storiesArray
            if (response?.data?.success) {
                const foodStories = response.data.stories;
                if (foodStories?.length > 0) {
                    storiesArray = flattenArray(foodStories)

                    setAllFoodStories(storiesArray)
                    setFoodStories(storiesArray?.slice(currIndex, currIndex + 4))
                    setCurrIndex(4)
                    setNoFoodStories(false)
                } else {
                    setNoFoodStories(true)
                    setHasMore(false)
                }
                if (storiesArray.length > 4) {
                    setHasMore(true)
                }
            }
        }, (error) => {
            console.log("error while fetching", error)
        })
    }

    const seeMore = () => {
        const newIndex = currIndex + 4
        const newStories = allFoodStories?.slice(currIndex, currIndex + 4);
        setFoodStories([...foodstories, ...newStories]);
        setCurrIndex(newIndex);

        if (newIndex >= allFoodStories.length) {
            setHasMore(false);
        }


    }
    return (
        <div className={Style.foodStories}>
            <div className={Style.headingContainer}>
                <div className={Style.heading}>Top Stories About food</div>
            </div>
            <div className={Style.stories}>
                {foodstories?.map((item, index) => (
                    <div className={Style.storyContainer}>
                        <div key={index} className={Style.main} onClick={() => {
                            const modifiedItem = { ...item, storyId: item._id };
                            delete modifiedItem._id;
                            setStory([modifiedItem]);
                            setViewStory(true)
                            console.log("clicked story is", story)
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
            {
                noFoodStories && <div className={Style.no_stories}>
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
    )
}
