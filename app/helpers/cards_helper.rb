module CardsHelper
  def scroll_to_deck_path(deck)
    cards_path :anchor => "scroll_to=#{deck.id}"
  end

  def how_to_path(key)
    "cards.index.how_to.#{key}"
  end
end
