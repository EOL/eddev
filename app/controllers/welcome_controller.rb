class WelcomeController < ApplicationController
  def index
    @hero_image_partial = "welcome/slideshow"

    @slide_lesson_plan = LessonPlan.find_by(
      :grade_level => LessonPlanGradeLevel.find_by_human_name(:'2_5'),
      :human_name => :go_adapt
    )

    if !@slide_lesson_plan
      logger.error("Failed to retrieve lesson plan for slideshow")
    end
  end

  def about
    @hero_image_partial = "welcome/about_hero"
  end
end
