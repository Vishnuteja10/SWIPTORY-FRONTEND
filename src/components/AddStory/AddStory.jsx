import React, { useState } from 'react'
import Style from './AddStory.module.css'

import AddStoryDetails from '../AddStoryDetails/AddStoryDetails'

export default function AddStory() {

    return (

        <div className={Style.overlay}>

            <AddStoryDetails />

        </div>
    )
}
