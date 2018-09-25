import React from 'react'
import LightboxOverlay from 'components/shared/lightbox-overlay'
import styles from 'stylesheets/podcasts'


function attribution(title, author, license) {
  const parts = [];

  if (title) {
    parts.push(title);
    parts.push('by');
  }

  parts.push(author);
  parts.push(license);

  return parts.join(' ');
}

function PodcastImageLightbox(props) {
  return (
    <LightboxOverlay 
      isOpen={true}
      onRequestClose={props.handleRequestClose} 
      contentLabel={'Podcast image and credits'}
    >
      <div className={styles.lightboxImg}>
        <img src={props.image} />
        <div 
          dangerouslySetInnerHTML={{ __html: attribution(props.title, props.author, props.license) }} 
        />
      </div>
    </LightboxOverlay>
  );
}

export default PodcastImageLightbox;

