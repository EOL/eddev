class CardsController < ApplicationController
  def index
    @hero_image_partial = "shared/hero_slim"

    @food_chains_rummy = LessonPlan.find_by_human_name!("food_chains_rummy_9_12")
    @go_adapt = LessonPlan.find_by_human_name!("go_adapt_2_5")
    @thats_classified = LessonPlan.find_by_human_name!("thats_classified_2_5")
    @create_a_creature = LessonPlan.find_by_human_name!("create_a_creature_2_5")
    @banner_image = "cards/damselfly_banner.jpg"
    @banner_taxon = BannerTaxon.new("damselflies", "<em>Zygoptera</em>", 2764228)
  end

  def observer_cards
    @banner_image = "cards/bee_banner.png"
    @banner_taxon = BannerTaxon.new("bees", "<em>Apidae</em>", 677)
  end
end
