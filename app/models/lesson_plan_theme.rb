class LessonPlanTheme < ApplicationRecord
  include HasNameKey

  validates_presence_of :name_key
  validates_uniqueness_of :name_key
  validates_presence_of :icon_file
  validates_uniqueness_of :icon_file
  validates_presence_of :human_name
  validates_uniqueness_of :human_name

  has_many :lesson_plans, :foreign_key => "theme_id"

  def icon_path
    "lesson_plans/#{icon_file}"
  end
end
