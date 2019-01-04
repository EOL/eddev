class LessonPlansController < ApplicationController
  PDFS_PATH = File.join(Rails.root, "files", "lesson_plans")

  def index
    @hero_image_partial = 'lesson_plans/hero'
    @grade_levels = LessonPlanGradeLevel.all

    @ordered_themes = [
      LessonPlanTheme.find_by_human_name(:classification),
      LessonPlanTheme.find_by_human_name(:science_skills),
      LessonPlanTheme.find_by_human_name(:human_impact),
      LessonPlanTheme.find_by_human_name(:adaptations),
      LessonPlanTheme.find_by_human_name(:energy_flow),
    ]

    @ordered_perks = [
      LessonPlanPerk.find_by_human_name(:bio_stats),
      LessonPlanPerk.find_by_human_name(:field_work),
      LessonPlanPerk.find_by_human_name(:species_cards),
    ]
  end

  def show
    lesson_plan = LessonPlan.find_by_human_name(params[:name])
    redirect_to "#{lesson_plans_path}#scroll_to=#{lesson_plan.id}", status: 302
  end
end
