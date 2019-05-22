import React from 'react'

import styles from 'stylesheets/card_maker/simple_manager'

class SimpleResourceWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onImageLoadCalled: false  // This is only for tracking the case where there isn't a real image to load 
    };
  }

  componentDidMount() {
    this.fireOnImageLoadIfNeeded();
  }

  componentDidUpdate()  {
    this.fireOnImageLoadIfNeeded();
  }

  fireOnImageLoadIfNeeded = () => {
    if (
      !this.state.onImageLoadCalled && 
      this.props.loadImage &&
      !this.props.hasImage
    ) {
      this.setState({
        onImageLoadCalled: true
      }, this.props.onImageLoad);
    }
  }

  render() {
    const classNames = [styles.resource];

    if (this.props.extraClass) {
      classNames.push(this.props.extraClass);
    }

    return (
      <li 
        className={classNames.join(' ')}
        onClick={this.props.onClick}
        ref={this.props.domRef}
      >
        {this.props.children}
      </li>
    );
  }
}

export default SimpleResourceWrapper;

