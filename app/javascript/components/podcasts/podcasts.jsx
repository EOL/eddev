import React from 'react'

import Menu from 'components/shared/menu'
import ControlBar from './control-bar'
import CategoryList from './category-list'
import Podcast from './podcast'
import {alphaSortAsc} from 'lib/util/sorts'

import frogBanner from 'images/podcasts/frog_banner.jpg'
import logo from 'images/podcasts/logo.png'
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
      catGrpsStyle: { position: 'relative' },
      scrollPos: 'preBanner',
    };
  }

  componentDidMount() {
    $(document).scroll(this.updateScrollPos);
  }

  componentWillUnmount() {
    $(document).off('scroll', this.updateScrollPos);
  }

  handleBannerRef = (node) => {
    this.bannerHeight = $(node).outerHeight();
  }

  hasCatGrpsSideNode = () => {
    return this.catGrpsSideNode && $(this.catGrpsSideNode).css('display') !== 'none';
  }

  updateScrollPos = () => {
    const hasCatGrpsSideNode = this.hasCatGrpsSideNode();

    let scrollPos = 'preBanner';

    if (
      !(
        // Special case where podcast list is shorter than sidebar -- keep pre-banner position
        hasCatGrpsSideNode &&
        this.podListNode && 
        $(this.podListNode).height() < $(this.catGrpsSideNode).height()
      ) &&
      this.bannerHeight != null && 
      window.scrollY >= this.bannerHeight &&
      this.mainContentNode
    ) {
      let maxScroll = $(this.mainContentNode).height() + this.bannerHeight;
      scrollPos = 'postBanner';

      if (hasCatGrpsSideNode) {
        maxScroll -= $(this.catGrpsSideNode).height();
      }

      if (window.scrollY >= maxScroll) {
        scrollPos = 'postBannerMax';
      }
    }   

    if (scrollPos !== this.state.scrollPos) {
      this.setState({
        scrollPos: scrollPos
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

  curCategory = () => {
    return this.state.categoryId === null ? 
        null : 
        this.props.categoriesById[this.state.categoryId]
      ;
  }

  podList = () => {
    var elmts = []
      , curCategory = this.curCategory()
      ;

    if (curCategory !== null) {
      elmts.push((
        <li className={styles.catDesc} key="catdesc">{curCategory.desc}</li>
      ));
    }

    this.searchFilteredPodcasts().forEach((podcast) => {
      const fullTitle = `${podcast.title}, ${podcast.sciName}`;

      elmts.push((
        <Podcast 
          categoriesById={this.props.categoriesById}
          fullTitle={fullTitle}
          handleCategorySelect={this.handleCategorySelect}
          podcast={podcast}
          key={podcast.permId}
        />
      ));
    });

    return (
      <div>
        <div className={styles.sidebar}>
          {this.catList('sidebar')}
        </div>
        <ul className={styles.podList} ref={(node) => this.podListNode = node}>
          {elmts}
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
      this.props.categoriesById[this.state.categoryId].name;
  }


  handleCategorySelect = (id) => {
    const stateUpdate = {
            categoryId: id
          }
        ;

    if (this.state.view === 'category') {
      stateUpdate.view = 'default';
    }

    this.setState(stateUpdate, () => { window.scrollTo(0, 0) });
  }

  handleRequestOpenGroup = (group) => {
    // Firing/handling the scroll event ensures the sidebar doesn't spill over
    this.setState({
      openGroup: group
    }, () => $(document).scroll());
  }

  catList = (placement) => {
    const props = {
      groups: this.props.categoryGroups,
      openGroup: this.state.openGroup,
      handleRequestOpenGroup: this.handleRequestOpenGroup,
      categoriesById: this.props.categoriesById,
      handleCategorySelect: this.handleCategorySelect,
    }

    if (placement === 'sidebar') {
      props.className = this.catGrpsSideClassName();
      props.handleRef = (node) => { this.catGrpsSideNode = node };
    }

    return (
      <CategoryList {...props} />
    );
  }

  mainContent = () => {
    if (this.state.view === 'category') {
      return this.catList();
    } else {
      return this.podList();
    }
  }

  barsClassName = () => {
    const className = styles.bars;
    let otherClassName;

    if (this.state.scrollPos === 'preBanner') {
      otherClassName = styles.barsRel;
    } else if (this.state.scrollPos === 'postBanner') {
      otherClassName = styles.barsFix;
    } else {
      otherClassName = styles.barsAbs;
    }

    return `${className} ${otherClassName} js-fixed`;
  }

  barsStyle = () => {
    const style = {};

    if (
      this.state.scrollPos === 'postBannerMax' &&
      this.hasCatGrpsSideNode()
    ) {
      style.bottom = $(this.catGrpsSideNode).outerHeight();
    }

    return style;
  }

  catGrpsSideClassName = () => {
    const classes = [styles.catGrpsSide];

    if (this.state.scrollPos === 'postBanner') {
      classes.push(styles.catGrpsSideFix);

      if (this.hasCatBar()) {
        classes.push(styles.catGrpsSideFixTwoBars);
      }
    } else if (this.state.scrollPos === 'postBannerMax') {
      classes.push(styles.catGrpsSideAbs);
    }

    return classes.join(' ');
  }

  hasCatBar = () => {
    return this.state.categoryId !== null && this.state.view !== 'category';
  }

  render() {
    const hasCatBar = this.state.categoryId !== null && this.state.view !== 'category'
        , pastBannerClasses = [styles.pastBanner]
        , mainContentClasses = [styles.mainContent]
        , catBarClasses = [styles.catBarOuter]
        ;

    if (this.state.scrollPos !== 'preBanner') {
      if (hasCatBar) {
        pastBannerClasses.push(styles.pastBannerTwoBars);
      } else {
        pastBannerClasses.push(styles.pastBannerOneBar);
      }
    }

    return (
      <div>
        <main role="main" className={`${styles.main} is-nopad-bot`}>
          <div className={styles.banner} ref={this.handleBannerRef}>
            <div className={styles.logo}>
              <img src={logo} />
            </div>
          </div>
          <div className={pastBannerClasses.join(' ')} ref={(node) => this.mainContentNode = node}>
            <div className={this.barsClassName()} style={this.barsStyle()}>
              <ControlBar 
                view={this.state.view} 
                sorts={sorts}
                sort={this.state.sort}
                handleSortSelect={(sort) => this.setState({ sort: sort })}
                handleRequestSetView={(view) => this.setState({ view: view })}
                handleSearchInput={(val) => this.setState({ searchVal: val })}
                searchVal={this.state.searchVal}
                classNames={[styles.ctrlBarOuter]}
              />
              {
                hasCatBar &&
                <div className={catBarClasses.join(' ')}>
                  <div 
                    className={styles.catBar}
                    onClick={() => this.handleCategorySelect(null)}
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
            >{this.mainContent()}</div>
          </div>
        </main>
      </div>
    );
  }
}

export default Podcasts

