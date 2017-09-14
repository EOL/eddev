import React from 'react'
import ReactDOM from 'react-dom'

import { UserResources } from 'components/card_maker/card_manager'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <UserResources />,
    document.getElementById('UserResourcesReact'),
  )
})
