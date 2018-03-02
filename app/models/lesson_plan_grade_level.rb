class LessonPlanGradeLevel < ApplicationRecord
  include HasNameKey

  validates_presence_of :name_key
  validates_uniqueness_of :name_key
  validates_presence_of :human_name
  validates_uniqueness_of :human_name

  has_many :lesson_plans, :foreign_key => "grade_level_id"
end
