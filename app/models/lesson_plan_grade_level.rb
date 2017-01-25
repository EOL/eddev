class LessonPlanGradeLevel < ActiveRecord::Base
  include HasNameKey

  validates_presence_of :name_key
  validates_uniqueness_of :name_key
end
