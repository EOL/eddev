module CardsHelper
  ALL_DECKS = [
  {
    :title_key  => "aquatic",
    :desc_key   => "aquatic",
    :image_name => "aquatic_insects",
    :file_name => "aquatic_insects"
  },
  {
    :title_key => "bioblitz",
    :sub_key => "common_animal_groups",
    :desc_key => "bioblitz_common",
    :image_name => "bioblitz_common",
    :file_name => "bioblitz"
  },
  {
    :title_key => "earthwatch",
    :sub_key => "california_urban_tree",
    :desc_key => "earthwatch_cali_tree",
    :image_name => "earthwatch",
    :file_name => "earthwatch_trees"
  },
  {
    :title_key => "new_england",
    :sub_key => "bh_rocky_inter",
    :desc_key => "ne_bh_rocky",
    :image_name => "new_england_rocky",
    :file_name => "ne_rocky_intertidal"
  },
  {
    :title_key  => "new_england",
    :sub_key    => "ecocolumn",
    :desc_key   => "ecocolumn",
    :image_name => "ecocolumn",
    :file_name => "ne_ecocolumn"
  },
  {
    :title_key => "new_england",
    :sub_key => "urban_habitat_adaptations",
    :desc_key => "ne_urban",
    :image_name => "ne_urban",
    :file_name => "ne_urban"
  },
#  {
#    :title_key => "new_england",
#    :sub_key => "vernal_pools",
#    :desc_key => "ne_vernal",
#    :image_name => "ne_vernal",
#    :file_name => "not_found"
#  },
#  {
#    :title_key => "new_england",
#    :sub_key => "wright_farm",
#    :desc_key => "ne_wright",
#    :image_name => "ne_wright",
#    :file_name => "not_found"
#  },
  {
    :title_key => "okaloosa",
    :sub_key => "adaptations",
    :desc_key => "okaloosa_adapt",
    :image_name => "okaloosa_adapt",
    :file_name => "okaloosa_adaptations"
  },
  {
    :title_key => "okaloosa",
    :sub_key => "biodiversity",
    :desc_key => "okaloosa_bio",
    :image_name => "okaloosa_bio",
    :file_name => "okaloosa_biodiversity"
  },
  {
    :title_key => "okaloosa",
    :sub_key => "coastal_uplands",
    :desc_key => "okaloosa_coastal",
    :image_name => "okaloosa_coastal",
    :file_name => "okaloosa_coastal"
  },
  {
    :title_key => "okaloosa",
    :sub_key => "common_mammals",
    :desc_key => "okaloosa_common_mammals",
    :image_name => "okaloosa_mammals",
    :file_name => "okaloosa_mammals"
  },
  {
    :title_key => "okaloosa",
    :sub_key => "common_plants",
    :desc_key => "okaloosa_common_plants",
    :image_name => "okaloosa_plants",
    :file_name => "okaloosa_plants" 
  },
  {
    :title_key => "okaloosa",
    :sub_key => "freshwater_forested",
    :desc_key => "okaloosa_freshwater",
    :image_name => "okaloosa_freshwater",
    :file_name => "okaloosa_freshwater_forested"
  },
  {
    :title_key => "okaloosa",
    :sub_key => "hardwood_forested",
    :desc_key => "okaloosa_hardwood",
    :image_name => "okaloosa_hardwood",
    :file_name => "okaloosa_hardwood_forested"
  },
  {
    :title_key => "okaloosa",
    :sub_key => "pines_sandhill",
    :desc_key => "okaloosa_pines",
    :image_name => "okaloosa_pine",
    :file_name => "okaloosa_pines_sandhill"
  },
  {
    :title_key => "okaloosa",
    :sub_key => "sea_turtles",
    :desc_key => "okaloosa_sea_turtles",
    :image_name => "okaloosa_turtles",
    :file_name => "okaloosa_sea_turtles"
  },
  {
    :title_key => "okaloosa",
    :sub_key => "urban_habitats",
    :desc_key => "okaloosa_urban",
    :image_name => "okaloosa_urban",
    :file_name => "okaloosa_urban"
  },
#  {
#    :title_key => "okaloosa",
#    :sub_key => "common_birds",
#    :desc_key => "okaloosa_common_birds",
#    :image_name => "okaloosa_birds",
#    :file_name => "not_found"
#  },
#  {
#    :title_key => "okaloosa",
#    :sub_key => "emammal_camera",
#    :desc_key => "okaloosa_emammal",
#    :image_name => "okaloosa_emammal",
#    :file_name => "not_found"
#  },
  ]

  def all_decks
    ALL_DECKS
  end

  def scroll_to_deck_path(deck)
    cards_path :anchor => "scroll_to=#{deck.id}"
  end 

  def how_to_path(key)
    "cards.index.how_to.#{key}"
  end
end
