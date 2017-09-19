import React from 'react'
import ReactDOM from 'react-dom'

import CardMaker from '../components/card-maker/card-maker'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CardMaker/>,
    document.getElementById('CardMakerReact'),
  )
})
