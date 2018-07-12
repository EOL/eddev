import React from 'react'
import ReactDOM from 'react-dom'

import Podcasts from 'podcasts/components/podcasts'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Podcasts />,
    document.getElementById('PodcastsReact'),
  );
});

