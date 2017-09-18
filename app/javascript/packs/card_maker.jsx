import React from 'react'
import ReactDOM from 'react-dom'

import CardManager from '../components/card-maker/card-manager'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CardManager />,
    document.getElementById('CardManagerReact'),
  )
})
