class WelcomeController < ApplicationController
  def index
    @hero_image_partial = "welcome/slideshow"

    @slide_lesson_plan = LessonPlan.find_by(
      :grade_level => LessonPlanGradeLevel.find_by_human_name(:'6_8'),
      :human_name => :food_chains_rummy
    )
    @slide_deck = Deck.find_by_human_name(:bioblitz_common)

    if !@slide_lesson_plan
      logger.error("Failed to retrieve lesson plan for slideshow")
    end

    if !@slide_deck
      logger.error("Failed to retrieve deck for slideshow")
    end
  end

  def about
    @hero_image_partial = "welcome/about_hero"
  end
end
