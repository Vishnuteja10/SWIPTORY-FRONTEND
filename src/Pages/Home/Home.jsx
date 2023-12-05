import React, { useEffect } from 'react'
import Login from '../../components/login/Login'
import Style from './Home.module.css'
import Register from '../../components/register/Register'
import Header from '../../components/Headers/MainHeader/Header'
import Categories from '../../components/Categories/Categories'
import { useMediaQuery } from 'react-responsive'
import SmallScreenHeader from '../../components/Headers/MobileViewHeader/SmallScreenHeader'
import FoodStories from '../../components/stories/FoodStories/FoodStories'
import Story from '../../components/Story/Story'
import AddStory from '../../components/AddStory/AddStory'
import TravelStories from '../../components/stories/TravelStories/TravelStories'
import HealthFitness from '../../components/stories/HealthFitness/HealthFitness'
import Movies from '../../components/stories/Movies/Movies'
import EducationStories from '../../components/stories/EducationStories/EducationStories'
import YourStories from '../../components/stories/YourStories/YourStories'
import useStoryContext from '../../customhooks/useStoryContext'
import Bookmarks from '../../components/Bookmarks/Bookmarks'

export default function Home() {
    const isMobile = useMediaQuery({ query: '(max-width: 800px)' })

    const { category, selectedCategory, showBookmarks, setShowBookmarks, addStory, setAddStory, story, showYourStories, setShowYourStories, viewStory, openLogin, openRegister } = useStoryContext()

    console.log("story is", story)
    console.log("show your story", showYourStories)



    return (
        <div className={Style.main}>
            <div>
                {isMobile ? <SmallScreenHeader /> : <Header />}
            </div>
            {!showBookmarks &&
                <div>
                    {!showYourStories && <div className={Style.Categories}>
                        <Categories />
                    </div>}
                </div>}
            <div className={Style.stories}>
                {showBookmarks && <Bookmarks />}

                {!showBookmarks && <div>
                    {!showYourStories && <div>
                        {category == 'All' && <div>
                            {!isMobile && <YourStories />}
                            <FoodStories />
                            <TravelStories />
                            <HealthFitness />
                            <Movies />
                            <EducationStories />
                        </div>}
                    </div>}

                    {showYourStories && <YourStories />}

                </div>}

                {!showBookmarks && <div>
                    {!showYourStories && <div>
                        {category == "Food" && <FoodStories />}
                        {category == "Travel" && <TravelStories />}
                        {category == "Health" && <HealthFitness />}
                        {category == "Movies" && <Movies />}
                        {category == "Education" && <EducationStories />}
                    </div>}
                </div>}

            </div>
            <div className={Style.storyContainer}>
                {viewStory && <Story />}

            </div>
            <div className={Style.addStory}>
                {addStory && <AddStory />}
            </div>
            <div className={Style.login_register}>
                {openLogin && <Login />}
                {openRegister && <Register />}
            </div>
        </div>
    )
}
