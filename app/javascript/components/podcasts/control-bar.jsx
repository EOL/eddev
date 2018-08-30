import React from 'react'
import Menu from 'components/shared/menu'
import menuStyles from 'stylesheets/shared/menu'
import styles from 'stylesheets/podcasts'

class ControlBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortMenuOpen: false,
    }
  }

  closeBtn = () => {
    return (
      <div 
        className={styles.closeBtn}
        onClick={
          () => {
            this.props.handleRequestSetView('default');
            this.props.handleSearchInput('');
          }
        }
        key='1'
      >
        <i className="fa fa-times fa-lg" />
      </div>
    );
  }

  contents = () => {
    if (this.props.view === 'default') {
      return [
        <i 
          className={`fa fa-search fa-2x ${styles.ctrlBarBtn}`} 
          key='1'
          onClick={() => this.props.handleRequestSetView('search')}
        />,
        <i 
          className={`fa fa-th-large fa-2x ${styles.ctrlBarBtn} ${styles.ctrlBarBtnCat}`}
          onClick={() => this.props.handleRequestSetView('category')}
          key='2'
        />,
        <div className={styles.sort} key='3'>
          <span className={styles.sortLabel}>sort by: </span>
          <Menu 
            items={
              this.props.sorts.map((sort) => {
                return {
                  label: sort.label,
                  handleClick: () => this.props.handleSortSelect(sort)
                }
              })
            }
            anchorText={this.props.sort.label}
            open={this.state.sortMenuOpen}
            handleRequestOpen={() => this.setState({ sortMenuOpen: true })}
            handleRequestClose={() => this.setState({ sortMenuOpen: false })}
            extraClasses={[menuStyles.menuWrapSort]}
          />
        </div>
      ];
    } else if (this.props.view === 'category') {
      return [
        this.closeBtn(),
        <i className={`fa fa-th-large fa-2x ${styles.catIcon}`} key='2' />,
        <div className={styles.ctrlHdr} key='3'>categories</div>,
      ];
    } else if (this.props.view === 'search') {
      return [
        this.closeBtn(),
        <i className={`fa fa-search fa-2x ${styles.catIcon}`} key='2' />,
        <input 
          type="text" 
          className={styles.search} 
          key='3' 
          placeholder="start typing to search" 
          value={this.props.searchVal}
          onInput={(e) => this.props.handleSearchInput(e.target.value)}
        />
      ];
    } else {
      throw new TypeError('invalid view: ' + this.props.view);
    }
  }

  render() {
    return (
      <div className={styles.ctrlBarOuter}>
        <div className={styles.ctrlBar}>{this.contents()}</div>
      </div>
    );
  }
}

export default ControlBar
