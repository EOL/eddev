class LessonPlanPerk < ApplicationRecord
  #TODO: find a way to make models like this read-only without breaking shoulda-matchers
  #
  include HasNameKey

  validates_presence_of :name_key
  validates_presence_of :icon_name
  validates_presence_of :human_name
 validates_uniqueness_of :name_key
  validates_uniqueness_of :icon_name
  validates_uniqueness_of :human_name
  has_and_belongs_to_many :lesson_plans, :join_table => :lesson_plans_lesson_plan_perks
end
