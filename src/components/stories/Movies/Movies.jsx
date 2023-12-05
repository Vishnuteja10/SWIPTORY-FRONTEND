import React, { useEffect, useState } from 'react'
import Style from './Movies.module.css'
import axios from 'axios'
import useStoryContext from '../../../customhooks/useStoryContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

export default function Movies() {

    const [noMovieStories, setNoMovieStories] = useState(true)
    const [allMovieStories, setAllMovieStories] = useState([])
    const [moviestories, setMovieStories] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [currIndex, setCurrIndex] = useState(0)


    const { story, likeCount, userId, setStory, login, setViewStory, setAddStory, setStories, setIsEditStory, setStoryId } = useStoryContext()

    const MOVIE_STORIES_URL = 'https://swip-story-ux7p.onrender.com/api/movies-stories';

    const STORY_URL = 'https://swip-story-ux7p.onrender.com/api/get-story';

    useEffect(() => {
        getMovieStories();

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


    const getMovieStories = async () => {
        axios.get(MOVIE_STORIES_URL).then((response) => {

            let movieStories;
            let storiesArray;
            if (response?.data?.success) {
                movieStories = response.data.stories;
            }
            if (movieStories.length > 0) {
                storiesArray = flattenArray(movieStories)

                setAllMovieStories(storiesArray)
                setMovieStories(storiesArray?.slice(currIndex, currIndex + 4))
                setCurrIndex(4)
                setNoMovieStories(false)
            } else {
                setNoMovieStories(true)
                setHasMore(false)
            }
            if (storiesArray.length > 4) {
                setHasMore(true)
            }


        }, (error) => {
            console.log("error while fetching", error)
        })
    }

    const seeMore = () => {
        const newIndex = currIndex + 4
        const newStories = allMovieStories?.slice(currIndex, currIndex + 4);
        setMovieStories([...moviestories, ...newStories]);
        setCurrIndex(newIndex);
        console.log('Current Index:', currIndex);
        console.log('New Stories:', newStories);
        if (newIndex >= allMovieStories.length) {
            setHasMore(false);
        }

        console.log('uf', moviestories)
    }



    return (
        <div>
            <div className={Style.movieStories}>
                <div className={Style.headingContainer}>
                    <div className={Style.heading}>Top Stories About Movies</div>
                </div>
                <div className={Style.stories}>
                    {moviestories?.map((item, index) => (
                        <div className={Style.storyContainer}>
                            <div key={index} className={Style.main} onClick={() => {
                                const modifiedItem = { ...item, storyId: item._id };
                                delete modifiedItem._id;
                                setStory([modifiedItem]);
                                setViewStory(true)
                                console.log("clicked story is", story)
                            }} style={{ backgroundImage: `url(${item?.img})` }
                            }>
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
                {noMovieStories && <div className={Style.no_stories}>
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
