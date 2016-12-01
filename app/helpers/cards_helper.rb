module CardsHelper
  ALL_DECKS = [
  {
    :title_key  => "aquatic",
    :desc_key   => "aquatic",
    :image_name => "bioblitz"
  },
  {
    :title_key => "bioblitz",
    :sub_key => "common_animal_groups",
    :desc_key => "bioblitz_common",
    :image_name => "bioblitz"
  },
  {
    :title_key => "boston_harbor",
    :sub_key => "rocky_intertidal",
    :desc_key => "boston_rocky",
    :image_name => "bioblitz"
  },
  {
    :title_key => "earthwatch",
    :sub_key => "california_urban_tree",
    :desc_key => "earthwatch_cali_tree",
    :image_name => "bioblitz"
  },
  {
    :title_key => "ecocolumn",
    :desc_key => "ecocolumn",
    :image_name => "bioblitz"
  },
  {
    :title_key => "new_england",
    :sub_key => "urban_habitat_adaptations",
    :desc_key => "ne_urban",
    :image_name => "bioblitz"
  },
  ]

  def all_decks
    ALL_DECKS
  end
end
