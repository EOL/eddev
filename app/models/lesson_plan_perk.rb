class LessonPlanPerk < ActiveRecord::Base
  #TODO: find a way to make models like this read-only without breaking shoulda-matchers

  validates_presence_of :name_key
  validates_presence_of :icon_name
  validates_uniqueness_of :name_key
  validates_uniqueness_of :icon_name
  has_and_belongs_to_many :lesson_plans, :join_table => :lesson_plans_lesson_plan_perks

  def localized_name
    I18n.translate("models.lesson_plan_perk.name_keys.#{name_key}")
  end
end
