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
      searchVal: '',
      category: null
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

  controlBarClose = () => {
    return (
      <div 
        className={styles.closeBtn}
        onClick={
          () => {
            this.setState({ 
              view: 'default',
              searchVal: ''
            }) 
          }
        }
        key='1'
      >
        <i className="fa fa-times fa-lg" />
      </div>
    );
  }

  controlBarContents = () => {
    if (this.state.view === 'default') {
      return [
        <i 
          className={`fa fa-search fa-2x ${styles.ctrlBarBtn}`} 
          key='1'
          onClick={() => this.setState({ view: 'search' })}
        />,
        <i 
          className={`fa fa-th-large fa-2x ${styles.ctrlBarBtn}`}
          onClick={() => this.setState({ view: 'category' })}
          key='2'
        />
      ];
    } else if (this.state.view === 'category') {
      return [
        this.controlBarClose(),
        <i className={`fa fa-th-large fa-2x ${styles.catIcon}`} key='2' />,
        <div className={styles.ctrlHdr} key='3'>categories</div>,
      ];
    } else if (this.state.view === 'search') {
      return [
        this.controlBarClose(),
        <i className={`fa fa-search fa-2x ${styles.catIcon}`} key='2' />,
        <input 
          type="text" 
          className={styles.search} 
          key='3' 
          placeholder="start typing to search" 
          value={this.state.searchVal}
          onInput={(e) => this.setState({ searchVal: e.target.value })}
        />
      ];
    } else {
      throw new TypeError('invalid view: ' + this.state.view);
    }
  }

  searchFilteredPodcasts = () => {
    const that = this
        , lowerSearch = that.state.searchVal ? 
            that.state.searchVal.toLowerCase() :
            null
        ;


    return that.state.podcasts.filter((podcast) => {
      let a = true;

      return (
        that.state.category === null || 
        podcast.categories.find((cat) => {
          return cat.id === that.state.category.id
        })
      ) && (
        !lowerSearch ||
        podcast.title.toLowerCase().includes(lowerSearch) ||
        podcast.sciName.toLowerCase().includes(lowerSearch) ||
        podcast.description.toLowerCase().includes(lowerSearch)
      );
    });
  }

  podList = () => {
    return (
      <ul>
        {
          this.searchFilteredPodcasts().map((podcast) => {
            const fullTitle = `${podcast.title}, ${podcast.sciName}`;
            return (
              <li className={styles.pod} key={podcast.permId}>
                <div className={styles.lPodLeft}>
                  <img src={podcast.imagePath} />
                  <ul className={styles.podLinks}>
                    {
                      podcast.eolUrl != null &&
                      <li>
                        <a href={podcast.eolUrl}>EOL Page</a>
                      </li>
                    }
                    {
                      podcast.transcriptPath != null &&
                      <li>
                        <a href={podcast.transcriptPath}>Transcript</a>
                      </li>
                    }
                    {
                      podcast.lessonPlanUrl != null &&
                      <li>
                        <a href={podcast.lessonPlanUrl}>Lesson Plan</a>
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
                  <audio className={styles.podPlayer} src={podcast.audioPath} controls/>
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
                  <ul className={styles.cats}>
                    {
                      group.categories.map((cat) => {
                        return (
                          <li 
                            key={cat.id}
                            onClick={() => this.setCategory(cat)}
                          >{cat.name}</li>
                        );
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

  setCategory = (cat) => {
    this.setState({
      category: cat,
      openGroup: null,
      view: 'default'
    });
  }

  render() {
    let mainContent = this.state.view === 'category' ?
        this.catList() :
        this.podList()
      , hasCatBar = this.state.category !== null && this.state.view !== 'category'
      , mainContentClasses = [styles.mainContent]
      ;

    if (hasCatBar) {
      mainContentClasses.push(styles.mainContentCatBar);
    }

    return (
      <div>
        <main role="main" className={styles.main}>
          <div className={styles.ctrlBarOuter}>
            <div className={styles.ctrlBar}>{this.controlBarContents()}</div>
          </div>
          {
            hasCatBar &&
            <div className={styles.catBarOuter}>
              <div className={styles.catBar}>
                <i 
                  className='fa fa-angle-left fa-2x' 
                  onClick={() => this.setState({ category: null })}
                />
                <span>{this.state.category.name}</span>
              </div>
            </div>
          }
          <div className={mainContentClasses.join(' ')}>{mainContent}</div>
        </main>
      </div>
    );
  }
}

export default Podcasts

