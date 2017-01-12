class LessonPlanPerk < ActiveRecord::Base
  validates_presence_of :name_key
  validates_presence_of :icon_name
  validates_uniqueness_of :name_key
  validates_uniqueness_of :icon_name
end
