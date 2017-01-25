class LessonPlan < ActiveRecord::Base
  include HasNameKey

  validates_presence_of :theme
  validates_presence_of :name_key
  validates_presence_of :objective_keys
  validates_presence_of :desc_key
  validates_presence_of :grade_level
  validates_uniqueness_of :human_name, :scope => :grade_level_id
  validate :file_name_or_external_url_present_not_both
  belongs_to :theme, :class_name => "LessonPlanTheme"
  belongs_to :grade_level, :class_name => "LessonPlanGradeLevel"
  has_and_belongs_to_many :perks, :class_name => "LessonPlanPerk", :join_table => "lesson_plans_lesson_plan_perks"

  serialize :objective_keys, Array

  def download?
    file_name.present?
  end

  def external?
    !download?
  end

  def resource_path
    download? ? file_path : external_url
  end

  def file_path
    file_name.present? ? path_helper(file_name) : nil
  end

  def overview_path
    overview_file_name.present? ? path_helper(overview_file_name) : nil
  end
  
  def path_helper(name)
    "/lesson_plans/#{name}.pdf"
  end

#  def has_perk?(perk_name)
#    perks.find_by(:human_name => perk_name).present?
#  end
  
  def has_perk?(perk)
    perks.include?(perk)
  end

  def localized_desc
    I18n.translate("models.lesson_plan.descriptions.#{desc_key}",
      (overview_file_name.present? ?
        { :guide_path => overview_path } : 
        {}
      )
    ).html_safe
  end

  def localized_objectives
    objective_keys.map do |k| 
      I18n.translate("models.lesson_plan.objectives.#{k}").html_safe
    end
  end

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
