class LessonPlan < ActiveRecord::Base
  belongs_to :theme, :class_name => "LessonPlanTheme"
  validates_presence_of :theme
  validates_presence_of :name_key
  validates_presence_of :objective_keys
  validates_presence_of :desc_key
  validate :file_name_or_external_url_present_not_both
  has_and_belongs_to_many :perks, :class_name => "LessonPlanPerk", :join_table => "lesson_plans_lesson_plan_perks"

  serialize :objective_keys, Array

  private
    FILE_NAME_NEITHER_VALIDATION_ERROR_MSG = 
      "Either file_name or external_url must be present" 
    
    FILE_NAME_BOTH_VALIDATION_ERROR_MSG =
      "file_name and external_url cannot both be present"

  def file_name_or_external_url_present_not_both
    if !(file_name.present? || external_url.present?)
      errors.add(:file_name, FILE_NAME_NEITHER_VALIDATION_ERROR_MSG)
      errors.add(:external_url, FILE_NAME_NEITHER_VALIDATION_ERROR_MSG)
    elsif file_name.present? && external_url.present?
      errors.add(:file_name, FILE_NAME_BOTH_VALIDATION_ERROR_MSG)
      errors.add(:external_url, FILE_NAME_BOTH_VALIDATION_ERROR_MSG)
    end
  end
end
