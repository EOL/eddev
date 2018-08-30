import React from 'react'

import Menu from 'components/shared/menu'
import ControlBar from './control-bar'
import {alphaSortAsc} from 'lib/util/sorts'

import frogBanner from 'images/podcasts/frog_banner.jpg'
import layoutStyles from 'stylesheets/shared/react_layout'

import menuStyles from 'stylesheets/shared/menu'
import styles from 'stylesheets/podcasts'

const sorts = [
  {
    label: 'title',
    fn: alphaSortAsc('title')
  },
  {
    label: 'scientific name',
    fn: alphaSortAsc('sciName')
  }
];

class Podcasts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      podcasts: [],
      openGroup: null,
      view: 'default',
      searchVal: '',
      categoryId: null,
      sort: sorts[0]
    };
  }

  searchFilteredPodcasts = () => {
    const that = this
        , lowerSearch = that.state.searchVal ? 
            that.state.searchVal.toLowerCase() :
            null
        ;


    return that.props.podcasts.filter((podcast) => {
      let a = true;

      return (
        that.state.categoryId === null || 
        podcast.categoryIds.find((id) => {
          return id === that.state.categoryId
        })
      ) && (
        !lowerSearch ||
        podcast.title.toLowerCase().includes(lowerSearch) ||
        podcast.sciName.toLowerCase().includes(lowerSearch) ||
        podcast.description.toLowerCase().includes(lowerSearch)
      );
    }).sort(this.state.sort.fn);
  }

  podList = () => {
    return (
      <div>
        {this.catList(styles.catGrpsSide)}
        <ul className={styles.podList}>
          {
            this.searchFilteredPodcasts().map((podcast) => {
              const fullTitle = `${podcast.title}, ${podcast.sciName}`;
              return (
                <li className={styles.pod} key={podcast.permId}>
                  <div className={styles.lPodLeft}>
                    <img src={podcast.imagePath} />
                    {this.podLinks(podcast, styles.podLinksLeft)}
                  </div>
                  <div className={styles.lPodRight}>
                    <div className={styles.podTitle} dangerouslySetInnerHTML={{__html: fullTitle}} />
                    {
                      podcast.categoryIds != null && podcast.categoryIds.length > 0 &&
                      <ul className={styles.podCats}>
                        {
                          podcast.categoryIds.map((id) => {
                            return (
                              <li 
                                key={id} 
                                onClick={() => this.setState({ categoryId: id })}
                              >{this.props.categoriesById[id]}</li>    
                            );
                          })
                        }
                      </ul>
                    }
                    <p className={styles.podDesc}>{podcast.description}</p>
                    <audio className={styles.podPlayer} src={podcast.audioPath} controls/>
                  </div>
                  {this.podLinks(podcast, styles.podLinksRight)}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

  catList = (className) => {
    let classNames = [styles.catGrps];

    if (className) {
      classNames.push(className);
    }

    return (
      <ul className={classNames.join(' ')}>
        {
          this.props.categoryGroups.map((group) => {
            const groupOpen = this.state.openGroup === group
                , angleClass = groupOpen ? 'fa-angle-up' : 'fa-angle-down'
                ;

            return (
              <li className={styles.catGrp} key={group.id}>
                <div 
                  className={styles.catGrpName}
                  onClick={
                    () => { 
                      const newOpenGroup = this.state.openGroup === group ?
                        null :
                        group;
                      this.setState({ openGroup: newOpenGroup })
                    }
                  }
                >
                  <span>{group.name}</span>
                  <i className={`${styles.catGrpAngle} fa ${angleClass} fa-lg`} />
                </div>
                {
                  this.state.openGroup === group &&
                  <ul className={styles.cats}>
                    {
                      group.categoryIds.map((id) => {
                        const name = this.props.categoriesById[id];
                        return (
                          <li 
                            key={id}
                            onClick={() => this.setCategoryId(id)}
                          >{name}</li>
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

  setCategoryId = (id) => {
    this.setState({
      categoryId: id,
      openGroup: null,
      view: 'default'
    });
  }

  categoryName = () => {
    return this.state.categoryId === null ? 
      null : 
      this.props.categoriesById[this.state.categoryId];
  }

  podLinks = (podcast, className) => {
    return (
      <ul className={`${styles.podLinks} ${className}`}>
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
    );
  }

  render() {
    let mainContent = this.state.view === 'category' ?
        this.catList() :
        this.podList()
      , hasCatBar = this.state.categoryId !== null && this.state.view !== 'category'
      , mainContentClasses = [styles.mainContent]
      ;

    if (hasCatBar) {
      mainContentClasses.push(styles.mainContentCatBar);
    }

    return (
      <div>
        <main role="main" className={`${styles.main} is-nopad-bot`}>
          <ControlBar 
            view={this.state.view} 
            sorts={sorts}
            sort={this.state.sort}
            handleSortSelect={(sort) => this.setState({ sort: sort })}
            handleRequestSetView={(view) => this.setState({ view: view })}
            handleSearchInput={(val) => this.setState({ searchVal: val })}
            searchVal={this.state.searchVal}
          />
          {
            hasCatBar &&
            <div className={styles.catBarOuter}>
              <div 
                className={styles.catBar}
                onClick={() => this.setState({ categoryId: null })}
              >
                <i 
                  className='fa fa-angle-left fa-2x' 
                />
                <span>{this.categoryName()}</span>
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

