class LessonPlansController < ApplicationController
  PDFS_PATH = File.join(Rails.root, "files", "lesson_plans")

  def index
    @hero_image_partial = 'lesson_plans/hero'
    @scroll_to = params[:scroll_to]
    @grade_levels = LessonPlanGradeLevel.all

    @ordered_perks = [
      LessonPlanPerk.find_by_human_name(:bio_stats),
      LessonPlanPerk.find_by_human_name(:field_work),
      LessonPlanPerk.find_by_human_name(:species_cards),
    ]
  end
end
