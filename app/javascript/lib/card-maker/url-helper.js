export function cardMakerUrl(path) {
  return '/card_maker_ajax/' + path;
}

export function loResCardImageUrl(card) {
  return cardMakerUrl('cards/' + card.id + '_' + card.version + '_lo.svg');
}

export function hiResCardImageUrl(card) {
  return cardMakerUrl('cards/' + card.id + '_' + card.version + '_hi.svg');
}

