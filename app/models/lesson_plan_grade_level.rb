class LessonPlanGradeLevel < ActiveRecord::Base
  include HasNameKey

  validates_presence_of :name_key
  validates_uniqueness_of :name_key

  has_many :lesson_plans, :foreign_key => "grade_level_id"
end
