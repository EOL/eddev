class LessonPlanTheme < ActiveRecord::Base
  include HasNameKey

  validates_presence_of :name_key
  validates_uniqueness_of :name_key
  validates_presence_of :icon_file
  validates_uniqueness_of :icon_file

  has_many :lesson_plans, :foreign_key => "theme_id"

  def icon_path
    "lesson_plans/#{icon_file}"
  end

  def localized_name
    I18n.translate("models.lesson_plan_theme.name_keys.#{name_key}")
  end
end
