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
    </ul>
  );
}

function Podcast(props) {
  return (
    <li className={styles.pod} key={props.podcast.permId}>
      <div className={styles.lPodLeft}>
        <img src={props.podcast.imagePath} />
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
                  >{props.categoriesById[id]}</li>    
                );
              })
            }
          </ul>
        }
        <p className={styles.podDesc}>{props.podcast.description}</p>
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

