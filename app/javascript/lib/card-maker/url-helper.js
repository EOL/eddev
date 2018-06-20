export function cardMakerUrl(path, locale) {
  var parts = []
    , locale = locale || I18n.locale
    ;
  
  if (locale !== I18n.defaultLocale) {
    parts.push(locale);
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

