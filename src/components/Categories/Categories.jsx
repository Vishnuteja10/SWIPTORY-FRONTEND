import React, { useState } from 'react'
import Style from './categories.module.css'
import food from '../../assets/images/food.jpeg'
import education from '../../assets/images/education.jpeg'
import health from '../../assets/images/health.png'
import movies from '../../assets/images/movies.jpeg'
import travel from '../../assets/images/travel.png'
import all from '../../assets/images/all.jpeg'
import useStoryContext from '../../customhooks/useStoryContext'

export default function Categories() {

    const images = [{ img: all, title: 'All' }, { img: food, title: 'Food' }, { img: education, title: 'Education' }, { img: health, title: 'Health' }, { img: movies, title: 'Movies' }, { img: travel, title: 'Travel' }]
    const { category, setCategory, setShowYourStories, selectedItem, setSelectedItem } = useStoryContext()

    const selected = {
        border: '4px solid #00ACD2'
    }


    return (
        <div className={Style.categories}>
            {images.map((item, index) => (
                <div key={index} className={Style.outerBox} style={selectedItem == index ? selected : {}} onClick={() => {
                    setCategory(item.title)
                    setSelectedItem(index)
                    setShowYourStories(false)
                }}>
                    <div className={Style.main} style={{ backgroundImage: `url(${item.img})` }}>
                    </div>
                    <div className={Style.title}>{item.title}</div>
                </div>
            ))}

        </div>
    )
}
