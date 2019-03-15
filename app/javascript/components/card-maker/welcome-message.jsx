import React from 'react'

import styles from 'stylesheets/card_maker/card_manager'


function WelcomeMessage(props) {
  return (
    <div className={styles.userResources}>
      <h3>Welcome to the EOL Card Maker!</h3>
      <p>You can browse our public cards by selecting a deck from the table of contents on the left, or start making your own cards by selecting 'my cards'.</p>
    </div>
  );
}

export default WelcomeMessage;

