export function cardMakerUrl(path) {
  return '/card_maker_ajax/' + path;
}

export function loResCardImageUrl(cardId) {
  return cardMakerUrl('cards/' + cardId + '_lo.svg');
}

export function hiResCardImageUrl(cardId) {
  return cardMakerUrl('cards/' + cardId + '_hi.svg');
}
