import React from 'react'

import Page from 'shared/components/page'

import frogBanner from 'images/podcasts/frog_banner.jpg'
import layoutStyles from 'stylesheets/shared/react_layout'

class Podcasts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Page>
        <img src={frogBanner} className={layoutStyles.banner} />
      </Page>
    );
  }
}

export default Podcasts

