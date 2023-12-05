import React, { useEffect, useState } from 'react'
import Style from './EducationStories.module.css'
import axios from 'axios'
import useStoryContext from '../../../customhooks/useStoryContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export default function EducationStories() {

    const [noEducationStories, setNoEducationStories] = useState(true)
    const [allEducationStories, setAllEducationStories] = useState([])
    const [educationstories, setEducationStories] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [currIndex, setCurrIndex] = useState(0)


    const { story, userId, setUserId, likeCount, setStory, login, setViewStory, setAddStory, setStories, setIsEditStory, setStoryId } = useStoryContext()

    const STORY_URL = 'https://swip-story-ux7p.onrender.com/api/get-story';


    const EDUCATION_STORIES_URL = 'https://swip-story-ux7p.onrender.com/api/education-stories';

    useEffect(() => {
        getEducationStories();
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
            console.log("response is", response)
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

    const getEducationStories = async () => {
        axios.get(EDUCATION_STORIES_URL).then((response) => {

            let educationStories;
            if (response?.data?.success) {
                educationStories = response.data.stories;
            }
            if (educationStories.length > 0) {
                const storiesArray = flattenArray(educationStories)

                setAllEducationStories(storiesArray)
                setEducationStories(storiesArray?.slice(currIndex, currIndex + 4))
                setCurrIndex(4)
                setNoEducationStories(false)
            } else {
                setNoEducationStories(true)
                setHasMore(false)
            }
            if (allEducationStories.length > 4) {
                setHasMore(true)
            }


        }, (error) => {
            console.log("error while fetching", error)
        })
    }

    const seeMore = () => {
        const newIndex = currIndex + 4
        const newStories = allEducationStories?.slice(currIndex, currIndex + 4);
        setEducationStories([...educationstories, ...newStories]);
        setCurrIndex(newIndex);
        console.log('Current Index:', currIndex);
        console.log('New Stories:', newStories);
        if (newIndex >= allEducationStories.length) {
            setHasMore(false);
        }


    }
    return (
        <div>
            <div className={Style.educationStories}>
                <div className={Style.headingContainer}>
                    <div className={Style.heading}>Top Stories About Education</div>
                </div>
                <div className={Style.stories}>
                    {educationstories?.map((item, index) => (
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
                {noEducationStories && <div className={Style.no_stories}>
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
