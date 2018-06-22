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

