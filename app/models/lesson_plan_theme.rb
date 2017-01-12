class LessonPlanTheme < ActiveRecord::Base
  validates_presence_of :name_key
  validates_uniqueness_of :name_key
  validates_presence_of :icon_file
  validates_uniqueness_of :icon_file
end
