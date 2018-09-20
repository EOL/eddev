import React from 'react'

import Lightbox from 'components/shared/lightbox'

function PodcastImageLightbox(props) {
  return (
    <Lightbox handleRequestClose={props.handleRequestClose}>
      <img src={props.image} />
    </Lightbox>
  );
}

export default PodcastImageLightbox;

