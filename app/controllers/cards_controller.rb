class CardsController < ApplicationController
  def index
    @hero_image_partial = 'cards/cards_hero'

    @all_decks = Deck.all

    grade_level_2_5 = LessonPlanGradeLevel.find_by_human_name :'2_5'
    grade_level_9_12 = LessonPlanGradeLevel.find_by_human_name :'9_12'

    @food_chains_rummy = LessonPlan.find_by(:grade_level => grade_level_9_12,
      :human_name => :food_chains_rummy)
    @go_adapt = LessonPlan.find_by(:grade_level => grade_level_2_5,
      :human_name => :go_adapt)
    @thats_classified = LessonPlan.find_by(:grade_level => grade_level_2_5,
      :human_name => :thats_classified)
    @create_a_creature = LessonPlan.find_by(:grade_level => grade_level_2_5,
      :human_name => :create_a_creature)
  end

  def new
  end
end
