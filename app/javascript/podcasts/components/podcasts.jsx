import React from 'react'

import Page from 'shared/components/page'

import frogBanner from 'images/podcasts/frog_banner.jpg'
import layoutStyles from 'stylesheets/shared/react_layout'
import styles from 'stylesheets/podcasts'

class Podcasts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      podcasts: [] 
    };
  }

  componentDidMount() {
    $.getJSON(Routes.podcasts_all_ajax_path(), (result) => {
      this.setState({
        podcasts: result
      });
    });
  }

  render() {
    console.log(this.state.podcasts);
    return (
      <ul>
        {
          this.state.podcasts.map((podcast) => {
            const fullTitle = `${podcast.title}, ${podcast.sci_name}`;
            return (
              <li className={styles.pod} key={podcast.perm_id}>
                <div className={styles.lPodLeft}>
                  <img src={podcast.image_path} />
                </div>
                <div className={styles.lPodRight}>
                  <div className={styles.podTitle} dangerouslySetInnerHTML={{__html: fullTitle}} />
                  <div>{podcast.description}</div>
                </div>
              </li>
            );
          })
        }
      </ul>
    );
  }
}

export default Podcasts

