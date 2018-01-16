export function cardMakerUrl(path) {
  return '/card_maker_ajax/' + path;
}

export function cardImageUrl(cardId) {
  return cardMakerUrl('cards/' + cardId + '.svg');
}
