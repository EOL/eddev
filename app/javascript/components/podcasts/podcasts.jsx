import React from 'react'

import Menu from 'components/shared/menu'
import ControlBar from './control-bar'
import CategoryList from './category-list'
import Podcast from './podcast'
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
      sort: sorts[0],
      catGrpsTop: 0,
    };
  }

  componentDidMount() {
    $(document).scroll(this.handleScroll);
  }

  componentWillUnmount() {
    $(document).off('scroll', this.handleScroll);
  }

  handleBannerRef = (node) => {
    this.bannerHeight = $(node).outerHeight();
  }

  handleScroll = (e) => {
    let pastBanner
      , top
      , maxTop
      ;

    if (
      this.bannerHeight == null || 
      !this.catGrpsSideNode || 
      !this.mainContentNode
    ) {
      if (this.state.catGrpsTop !== 0) {
        // This fixes the mobile category view -- otherwise, the bars are stuck whereever they were last
        this.setState({
          catGrpsTop: 0
        });
      }

      return;
    }

    this.navbarHeight = this.navbarHeight || $('.js-navbar').outerHeight();

    if (window.scrollY > this.bannerHeight) {
      pastBanner = true;
    } else {
      pastBanner = false;
    }

    if (pastBanner) {
      top = window.scrollY - this.bannerHeight;
      maxTop = $(this.mainContentNode).height() - $(this.catGrpsSideNode).height();

      if ($(this.catGrpsSideNode).css('display') !== 'none' && maxTop < top) {
        top = maxTop;
      }
    } else {
      top = 0;
    }

    if (this.state.catGrpsTop !== top) {
      this.setState({
        catGrpsTop: top
      });
    }
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
        <div className={styles.sidebar}>
          {this.catList(
            styles.catGrpsSide,
            this.state.catGrpsTop,
            (node) => { this.catGrpsSideNode = node }
          )}
        </div>
        <ul className={styles.podList}>
          {
            this.searchFilteredPodcasts().map((podcast) => {
              const fullTitle = `${podcast.title}, ${podcast.sciName}`;
              return ( 
                <Podcast 
                  categoriesById={this.props.categoriesById}
                  fullTitle={fullTitle}
                  handleCategorySelect={this.handleCategorySelect}
                  podcast={podcast}
                  key={podcast.permId}
                />
              )
            })
          }
        </ul>
      </div>
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


  handleCategorySelect = (id) => {
    const stateUpdate = {
            categoryId: id
          }
        ;

    if (this.state.view === 'category') {
      stateUpdate.view = 'default';
    }

    this.setState(stateUpdate);
  }

  handleRequestOpenGroup = (group) => {
    // Firing/handling the scroll event ensures the sidebar doesn't spill over
    this.setState({
      openGroup: group
    }, () => $(document).scroll());
  }

  catList = (className, top, handleRef) => {
    return (
      <CategoryList
        groups={this.props.categoryGroups}
        openGroup={this.state.openGroup}
        handleRequestOpenGroup={this.handleRequestOpenGroup}
        categoriesById={this.props.categoriesById}
        handleCategorySelect={this.handleCategorySelect}
        className={className}
        top={top}
        handleRef={handleRef}
      />
    );
  }

  mainContent = () => {
    if (this.state.view === 'category') {
      return this.catList();
    } else {
      return this.podList();
    }
  }

  render() {
    const hasCatBar = this.state.categoryId !== null && this.state.view !== 'category'
        , pastBannerClasses = [styles.pastBanner]
        , mainContentClasses = [styles.mainContent]
        , controlBarClasses = [styles.ctrlBarOuter]
        , catBarClasses = [styles.catBarOuter]
        ;

    if (hasCatBar) {
      pastBannerClasses.push(styles.pastBannerCatBar);
    }

    return (
      <div>
        <main role="main" className={`${styles.main} is-nopad-bot`}>
          <div className={styles.banner} ref={this.handleBannerRef} />
          <div className={pastBannerClasses.join(' ')}>
            <div className={styles.bars} style={{top: this.state.catGrpsTop}}>
              <ControlBar 
                view={this.state.view} 
                sorts={sorts}
                sort={this.state.sort}
                handleSortSelect={(sort) => this.setState({ sort: sort })}
                handleRequestSetView={(view) => this.setState({ view: view })}
                handleSearchInput={(val) => this.setState({ searchVal: val })}
                searchVal={this.state.searchVal}
                classNames={controlBarClasses}
              />
              {
                hasCatBar &&
                <div className={catBarClasses.join(' ')}>
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
            </div>
            <div 
              className={styles.mainContent}
              ref={(node) => this.mainContentNode = node}
            >{this.mainContent()}</div>
          </div>
        </main>
      </div>
    );
  }
}

export default Podcasts

