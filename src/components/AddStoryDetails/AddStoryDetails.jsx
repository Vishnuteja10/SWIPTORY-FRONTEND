import React, { useEffect, useState } from 'react'
import Style from './AddStoryDetails.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import useStoryContext from '../../customhooks/useStoryContext'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'

export default function AddStoryDetails() {

    const isMobile = useMediaQuery({ query: '(max-width: 800px)' })

    const ADD_POST = "https://swip-story-ux7p.onrender.com/api/add-story";

    const UPDATE_POST = "https://swip-story-ux7p.onrender.com/api/update-story"



    const selectedSlide = {
        border: '2px solid rgb(6, 207, 207) '
    }

    const { setAddStory, token, userId, setStories, stories, isEditStory, setIsEditStory, storyId } = useStoryContext()

    const [slides, setSlides] = useState(3)
    const [category, setCategory] = useState("category")
    const [heading, setHeading] = useState()
    const [image, setImage] = useState()
    const [description, setDescription] = useState()
    const [currStoryIndex, setCurrStoryIndex] = useState(0)

    useEffect(() => {
        if (stories.length > 3) {
            setSlides(stories.length)
        } else {
            setSlides(3)
        }
    }, [])

    useEffect(() => {
        const story = stories[currStoryIndex];
        if (story) {
            setCategory(story.category);
            setDescription(story.description);
            setHeading(story.heading);
            setImage(story.image)
            console.log("inside useffect", story)
        } else {
            setCategory('category');
            setDescription("");
            setHeading('');
            setImage("")

        }

    }, [currStoryIndex, stories])

    const updateStories = async (stories, storyId) => {
        const headers = {
            token: token
        }
        axios.put(UPDATE_POST, { stories, storyId }, { headers }).then(
            (response) => {
                console.log(response)
                if (response?.data?.success) {
                    setStories([]);
                    setCurrStoryIndex(0)
                    setSlides(3)
                    alert("story updated successfully")
                    setAddStory(false)
                }
            }, (error) => {
                console.log(error)
                alert("failed to add story")
            }
        )
    }

    const addStories = async (stories, userId) => {
        const headers = {
            token: token
        }
        axios.post(ADD_POST, { userId, stories }, { headers }).then(
            (response) => {

                if (response?.data?.success) {
                    setStories([]);
                    setCurrStoryIndex(0);
                    setSlides(3)
                    alert("story posted successfully")
                }
            }, (error) => {
                console.log("error while adding story", error)
                console.log("error story addingggggggggggggggggggggg", error, error.message)
                alert("failed to post story")
            }
        )
    }




    const post = (e) => {
        e.preventDefault();

        if (currStoryIndex >= 2 && currStoryIndex === slides - 1) {

            if (category == 'category' || !heading || !image || !description) {
                alert("please fill all fields before moving to next!")
                return
            }
            console.log(heading, image, description, category);
            const story = {
                heading,
                image,
                description,
                category
            }

            const updatedStories = [...stories];
            updatedStories[currStoryIndex] = story;
            setStories(updatedStories);

            console.log("stories to post", updatedStories);
            if (isEditStory) {
                updateStories(updatedStories, storyId)
                return
            }
            addStories(updatedStories, userId);
            return


        }
        if (stories.length < 3) {
            alert("please add atleast three slides")
            return
        }
        if (isEditStory) {
            updateStories(stories, storyId)
            return
        }

        addStories(stories, userId)
    }


    const remove = (indexToRemove) => {

        const updatedStories = stories.filter((_, index) => index !== indexToRemove);
        setStories(updatedStories);
        if (indexToRemove == currStoryIndex) {
            setCurrStoryIndex((prev) => prev - 1)
        }

    }

    const prev = (e) => {
        e.preventDefault();
        if (currStoryIndex === 0) {
            return;
        }
        setCurrStoryIndex((prev) => prev - 1)
    }

    const next = (e) => {
        e.preventDefault()
        if (currStoryIndex >= slides - 1) {
            return
        }

        if (stories[currStoryIndex] == undefined) {

            if (category == 'category' || !heading || !image || !description) {
                alert("all fields are required")
                return
            }
            console.log(heading, image, description, category);
            const story = {
                heading,
                image,
                description,
                category
            }

            setStories([...stories, story])
            setCurrStoryIndex((prev) => prev + 1)
            setCategory("category");
            setDescription("");
            setHeading('');
            setImage('')
        } else {
            setCurrStoryIndex((prev) => prev + 1)
        }


    }



    return (
        <div>
            <div className={Style.outerBlock}>
                <div className={Style.main}>
                    <div className={Style.closeContainer}>
                        <div className={Style.closeIcon} onClick={() => {
                            setAddStory(false)
                        }}>
                            <FontAwesomeIcon className={Style.icon} icon={faXmark} style={{ color: "#f12704", }} />
                        </div>
                        {!isMobile && <p >Add upto 6 slides</p>}
                    </div>
                    {isMobile && <div className={Style.titleContainer}>
                        <div>Add story to feed</div>
                    </div>}
                    <div className={Style.formContainer} >
                        <div className={Style.slides}>
                            {[...Array(slides)].map((_, index) => (
                                <div className={Style.slide}>
                                    <div key={index} className={Style.slideNumber} onClick={() => {
                                        setCurrStoryIndex(index)
                                    }} style={index == currStoryIndex ? selectedSlide : {}} >
                                        Slide{index + 1}
                                    </div>

                                    {index > 2 && <div className={Style.removeSlide} onClick={(event) => {
                                        event.stopPropagation();
                                        setSlides((prev) => prev - 1)
                                        remove(index)
                                    }}>
                                        <FontAwesomeIcon className={Style.icon} icon={faXmark} style={{ color: "#f12704", }} />
                                    </div>}

                                </div>
                            ))}

                            {slides < 6 && <div className={Style.slideNumber} onClick={() => {
                                setSlides((prev) => prev + 1)
                            }}>
                                Add+
                            </div>}
                        </div>
                        <div className={Style.storyContent}>
                            <div>
                                <div className={Style.headingContainer}>
                                    <div className={Style.heading}>Heading:</div>
                                    <div className={Style.headingValue}>
                                        <input type='text' placeholder='Your heading' value={heading} onChange={(e) => {
                                            setHeading(e.target.value)
                                        }} className={Style.textContent} />
                                    </div>
                                </div>
                                <div className={Style.descriptionContainer}>
                                    <div className={Style.description}>Description:</div>
                                    <div className={Style.descriptionValue}>
                                        <textarea type='text' placeholder='Story description' value={description} onChange={(e) => {
                                            setDescription(e.target.value)
                                        }} className={Style.textArea} />
                                    </div>
                                </div>
                                <div className={Style.imageContainer}>
                                    <div className={Style.image}>Image:</div>
                                    <div className={Style.imageValue}>
                                        <input type='text' placeholder='Add Image url' value={image} onChange={(e) => {
                                            setImage(e.target.value)
                                        }} className={Style.textContent} />
                                    </div>
                                </div>
                                <div className={Style.categoryContainer}>
                                    <div className={Style.category}>
                                        Category:
                                    </div>
                                    <div className={Style.categoryValue}>
                                        <select
                                            name="company"
                                            id="company"
                                            className={Style.select}
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option value={"category"} disabled hidden>
                                                Select Category
                                            </option>
                                            <option value={"Food"}>food</option>
                                            <option value={"HealthFitness"}>health and fitness</option>
                                            <option value={"Travel"}>travel</option>
                                            <option value={"Movies"}>movies</option>
                                            <option value={"Education"}>education</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={Style.buttonsContainer}>
                        {!isMobile && <div className={Style.prev_next_container}>
                            <button className={Style.prev} onClick={prev}>Previous</button>
                            <button className={Style.next} onClick={next}>Next</button>
                        </div>}
                        <div>
                            <button className={Style.post} onClick={post} >Post</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
