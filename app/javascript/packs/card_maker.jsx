import React from 'react'
import ReactDOM from 'react-dom'

import CardMaker from 'components/card-maker/card-maker'
import {cardMakerUrl} from 'lib/card-maker/url-helper'

// Module initialization
CardWrapper.setDataPersistence({
  save: function(card, cb) {
    const url = cardMakerUrl('/cards/' + card.id + '/save');

    $.ajax({
      url: url,
      method: 'PUT',
      data: JSON.stringify({ data: card.data, userData: card.userData }),
      contentType: 'application/json',
      success: function() {
        cb()
      },
      error: function() {
        //TODO: log error?
        cb(new Error('Failed to save card'));
      }
    });
  }
});

CardWrapper.setTemplateSupplier({
  supply: function(name, version, locale, cb) {
    $.ajax({
      url: cardMakerUrl('templates/' + name + '/' + version),
      success: function(data) {
        cb(null, data);
      },
      error: function() {
        cb(new Error('Failed to retrieve template'));
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CardMaker/>,
    document.getElementById('CardMakerReact'),
  )
})
