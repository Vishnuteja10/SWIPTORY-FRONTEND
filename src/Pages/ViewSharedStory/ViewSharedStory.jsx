import React, { useState, useEffect } from 'react'
import Style from './ViewSharedStory.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faXmark, faPaperPlane, faBookmark, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { useMediaQuery } from 'react-responsive'
import { useLocation } from 'react-router-dom'

export default function ViewSharedStory() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const storyId = searchParams.get('storyId');
    const storyindex = searchParams.get('storyindex');
    const id = searchParams.get('id');
    const isMultiple = searchParams.get('isMultiple');



    const isMobile = useMediaQuery({ query: '(max-width: 800px)' })

    const [story, setStory] = useState([{}])
    const [index, setIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    const eachProgressWidth = 24 / story?.length;
    const widthInc = eachProgressWidth / 5;

    const eachProgressWidthInMobile = 98 / story?.length;
    const widthIncrementMobile = eachProgressWidthInMobile / 5;



    const GET_STORY = 'https://swip-story-ux7p.onrender.com/api/specific-story'

    const getStories = async () => {
        axios.get(GET_STORY, { params: { id, storyId, isMultiple } }).then((response) => {
            console.log(response.data)
            if (response?.data?.success) {
                const story = response?.data?.story?.stories;
                setStory(story);
            }
        }, (error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        const indexValue = parseInt(storyindex, 10)
        setIndex(indexValue)
        const fetchData = async () => {
            try {
                await getStories();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, storyId, isMultiple]);


    useEffect(() => {
        const interval = setInterval(() => {

            if (index < story?.length - 1) {
                setIndex((prev) => prev + 1)
                setProgress(0)
            } else {
                clearInterval(interval)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [index, story])


    useEffect(() => {
        const interval = setInterval(() => {
            if (isMobile) {
                if (progress < eachProgressWidthInMobile) {
                    setProgress((prev) => prev + widthIncrementMobile)
                } else {
                    clearInterval(interval)
                }

            } else {
                if (progress < eachProgressWidth) {
                    setProgress((prev) => prev + widthInc)
                } else {
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
        if (index + 1 < story?.length) {
            setIndex((prev) => prev + 1);
            setProgress(0);
        }
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

                        </div>

                        <div className={Style.content}>
                            <div className={Style.header}>{story[index]?.heading}</div>
                            <div className={Style.description}> {story[index]?.description} </div>
                        </div>
                    </div>
                    <div className={Style.leftArrow} onClick={moveLeft}><FontAwesomeIcon icon={faChevronLeft} style={{ color: "#ffffff", }} /></div>
                    <div className={Style.rightArrow} onClick={moveRight}><FontAwesomeIcon icon={faChevronRight} style={{ color: "#ffffff", }} /></div>
                </div>
            </div>
        </div>

    )
}
