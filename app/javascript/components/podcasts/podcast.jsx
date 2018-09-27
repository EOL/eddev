import React from 'react'
import styles from 'stylesheets/podcasts'

function PodLinks(props) {
  return (
    <ul className={`${styles.podLinks} ${props.className}`}>
      {
        props.podcast.eolUrl != null &&
        <li>
          <a href={props.podcast.eolUrl}>EOL Page</a>
        </li>
      }
      {
        props.podcast.transcriptPath != null &&
        <li>
          <a href={props.podcast.transcriptPath}>Transcript</a>
        </li>
      }
      {
        props.podcast.lessonPlanUrl != null &&
        <li>
          <a href={props.podcast.lessonPlanUrl}>Lesson Plan</a>
        </li>
      }
      {
        props.podcast.audioSlideshowUrl != null &&
        <li>
          <a href={props.podcast.audioSlideshowUrl}>Slideshow</a>
        </li>
      }
    </ul>
  );
}

function Podcast(props) {
  return (
    <li ref={props.handleRef} className={styles.pod} id={props.podcast.permId}>
      <div className={styles.lPodLeft}>
        <div className={styles.podImg} onClick={props.requestImageLightbox}>
          <img  src={props.podcast.image.path} />
          <div><i className={'fa fa-expand fa-2x'} /></div>
        </div> 
        <PodLinks
          podcast={props.podcast}
          className={styles.podLinksLeft}
        />
      </div>
      <div className={styles.lPodRight}>
        <div className={styles.podTitle} dangerouslySetInnerHTML={{__html: props.fullTitle}} />
        {
          props.podcast.categoryIds != null && props.podcast.categoryIds.length > 0 &&
          <ul className={styles.podCats}>
            {
              props.podcast.categoryIds.map((id) => {
                return (
                  <li 
                    key={id} 
                    onClick={() => props.handleCategorySelect(id)}
                  >{props.categoriesById[id].name}</li>    
                );
              })
            }
          </ul>
        }
        <p className={styles.podDesc} dangerouslySetInnerHTML={{__html: props.podcast.description}} />
        <audio className={styles.podPlayer} src={props.podcast.audioPath} controls/>
      </div>
      <PodLinks 
        podcast={props.podcast}
        className={styles.podLinksRight}
      />
    </li>
  );
}

export default Podcast;

