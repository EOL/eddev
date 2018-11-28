export function cardMakerUrl(path) {
  var parts = [];
  
  if (I18n.locale !== I18n.defaultLocale) {
    parts.push(I18n.locale);
  }

  parts.push('card_maker_ajax');
  parts.push(path);

  return '/' + parts.join('/');
}

export function loResCardImageUrl(card) {
  return cardMakerUrl('cards/' + card.id + '_' + card.version + '_lo.svg');
}

export function hiResCardImageUrl(card) {
  return cardMakerUrl('cards/' + card.id + '_' + card.version + '_hi.svg');
}

export function deckUrl(deck) {
  return Routes.card_maker_url({ 
    locale: (I18n.locale === I18n.defaultLocale ? null : I18n.locale) 
  }) + '#deck_id=' + deck.id;
}

export function createCardUrl(deck) {
  return deck ? 
    cardMakerUrl('decks/' + deck.id + '/cards') :
    cardMakerUrl('cards');
}

