import React from 'react'

import Page from 'shared/components/page'

import frogBanner from 'images/podcasts/frog_banner.jpg'
import layoutStyles from 'stylesheets/shared/react_layout'
import styles from 'stylesheets/podcasts'

class Podcasts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      podcasts: [],
      categoryGroups: [],
      openGroup: null,
      view: 'default',
    };
  }

  componentDidMount() {
    $.getJSON(Routes.podcasts_path({ format: 'json' }), (result) => {
      this.setState({
        podcasts: result
      });
    });
    $.getJSON(Routes.podcast_category_groups_path({ format: 'json' }), (result) => {
      console.log('categories', result);
      this.setState({
        categoryGroups: result
      });
    });
  }

  controlBarContents = () => {
    if (this.state.view === 'default') {
      return [
        <i className="fa fa-search fa-2x" key='1'/>,
        <i 
          className="fa fa-th-large fa-2x" 
          onClick={() => this.setState({ view: 'category' })}
          key='2'
        />
      ];
    } else if (this.state.view === 'category') {
      return [
        <div 
          className={styles.closeBtn}
          onClick={() => this.setState({ view: 'default' })}
          key='1'
        >
          <i className="fa fa-times fa-lg" />
        </div>,
        <i className={`fa fa-th-large fa-2x ${styles.catIcon}`} key='2' />,
        <div className={styles.ctrlHdr} key='3'>categories</div>,
      ];
    } else {
      throw new TypeError('invalid view: ' + this.state.view);
    }
  }

  podList = () => {
    return (
      <ul>
        {
          this.state.podcasts.map((podcast) => {
            const fullTitle = `${podcast.title}, ${podcast.sci_name}`;
            return (
              <li className={styles.pod} key={podcast.perm_id}>
                <div className={styles.lPodLeft}>
                  <img src={podcast.image_path} />
                  <ul className={styles.podLinks}>
                    {
                      podcast.eol_page_id != null &&
                      <li>
                        <a href={`https://eol.org/pages/${podcast.eol_page_id}`}>EOL Page</a>
                      </li>
                    }
                    {
                      podcast.transcript_path != null &&
                      <li>
                        <a href={podcast.transcript_path}>Transcript</a>
                      </li>
                    }
                    {
                      podcast.lesson_plan_url != null &&
                      <li>
                        <a href={podcast.lesson_plan_url}>Lesson Plan</a>
                      </li>
                    }
                  </ul>
                </div>
                <div className={styles.lPodRight}>
                  <div className={styles.podTitle} dangerouslySetInnerHTML={{__html: fullTitle}} />
                  {
                    podcast.categories != null && podcast.categories.length > 0 &&
                    <ul className={styles.podCats}>
                      {
                        podcast.categories.map((cat) => {
                          return <li key={cat.id}>{cat.name}</li>    
                        })
                      }
                    </ul>
                  }
                  <div>{podcast.description}</div>
                  <audio className={styles.podPlayer} src={podcast.audio_path} controls/>
                </div>
              </li>
            );
          })
        }
      </ul>
    );
  }

  catList = () => {
    return (
      <ul className={styles.catGrps}>
        {
          this.state.categoryGroups.map((group) => {
            return (
              <li className={styles.catGrp} key={group.id}>
                <div 
                  className={styles.catGrpName}
                  onClick={
                    () => { 
                      const newOpenGroup  = this.state.openGroup === group ?
                        null :
                        group;
                      this.setState({ openGroup: newOpenGroup })
                    }
                  }
                >{group.name}</div>
                {
                  this.state.openGroup === group &&
                  <ul>
                    {
                      group.categories.map((cat) => {
                        return <li key={cat.id}>{cat.name}</li>
                      })
                    }
                  </ul>
                }
              </li>
            );
          })
        }
      </ul>
    );
  }

  render() {
    let mainContent = this.state.view === 'category' ?
        this.catList() :
        this.podList()
      ;

    return (
      <div>
        <div className={styles.ctrlBar}>{this.controlBarContents()}</div>
        {mainContent}
      </div>
    );
  }
}

export default Podcasts

