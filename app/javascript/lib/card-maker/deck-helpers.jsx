import React from 'react'

export function deckNameCardCount(deck, name) {
  if (deck.cardCount != null) {
    return (
      <span>
        <span>{name || deck.name}&nbsp;</span>
        <em>({deck.cardCount})</em>
      </span>
    );
  } else {
    return name || deck.name;
  }
}
