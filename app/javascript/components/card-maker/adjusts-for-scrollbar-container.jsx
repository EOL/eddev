import React from 'react'

class AdjustsForScrollbarContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemMarginRight: null,
    }
  }

  // Set margin of resources dynamically to account for scrollbar weirdness
  // once all node refs are in
  updateItemMarginRight = () => {
    const childCount = React.Children.count(this.props.children);

    if (
      this.rootNode &&
      this.itemNode &&
      this.itemRefCount === childCount
    ) {
      const scrollbarWidth = this.rootNode.offsetWidth - this.rootNode.clientWidth
          , innerWidth = $(this.rootNode).width()
          , resourceWidth = $(this.itemNode).outerWidth()
          , marginRight = (
              innerWidth - scrollbarWidth -
              resourceWidth * this.props.itemsPerRow
            ) /
            (this.props.itemsPerRow - 1)
          ;

      this.setState({
        itemMarginRight: marginRight,
      });
    }
  }

  itemRef = (node) => {
    if (node) {
      this.itemRefCount++;
      this.itemNode = node;
      this.updateItemMarginRight();
    }
  }

  rootRef = (node) => {
    if (node) {
      this.rootNode = node;
      this.updateItemMarginRight();
    }
  }

  render() {
    this.itemCount = this.props.children.length;
    this.itemRefCount = 0;

    const that = this
        , augmentedChildren =
            React.Children.toArray(this.props.children).map((child, i) => {
              const style = {};

              if (this.state.itemMarginRight && (i + 1) % this.props.itemsPerRow !== 0) {
                style.marginRight = this.state.itemMarginRight;
              }

              return React.cloneElement(child, {
                setRef: that.itemRef,
                style: style,
              });
            })
        ;

    return (
      <ul className={this.props.className} ref={this.rootRef}>
        {augmentedChildren}
      </ul>
    )
  }
}

export default AdjustsForScrollbarContainer
