import React from 'react'
import styles from 'stylesheets/card_resources'

class CardResources extends React.Component {
  render() {
    return (
      <div className={styles.cardResources}>
        <div className={styles.boxes}>
          <div className={styles.boxWelcome}>
            <h2>Welcome to the EOL Card Maker</h2>
            <p>This whole project is an over-engineered waste of time this whole project is an over-engineered waste of time etc etc.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default CardResources;

