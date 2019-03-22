class CardsController < ApplicationController
  def index
    @hero_image_partial = "shared/hero_slim"

    @food_chains_rummy = LessonPlan.find_by_human_name!("food_chains_rummy_9_12")
    @go_adapt = LessonPlan.find_by_human_name!("go_adapt_2_5")
    @thats_classified = LessonPlan.find_by_human_name!("thats_classified_2_5")
    @create_a_creature = LessonPlan.find_by_human_name!("create_a_creature_2_5")
  end

  def observer_cards
    @banner_image = "cards/bee_banner.png"
  end
end
