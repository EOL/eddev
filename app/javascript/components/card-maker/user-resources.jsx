import React from 'react'
import Card from './card'

class UserResources extends React.Component {
  render() {
    console.log('render resources');
    const cardElmts = this.props.cards.map(function(card) {
      return (
        <Card
          id={card.id}
          key={card.id}
        />
      )
    });

    return <div className="user-resources">{cardElmts}</div>;
  }
}

export default UserResources
