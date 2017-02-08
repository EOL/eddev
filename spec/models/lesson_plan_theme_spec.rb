require 'rails_helper'

RSpec.describe LessonPlanTheme, type: :model do
  it { should validate_presence_of :name_key }
  it { should validate_presence_of :icon_file }
  it { should validate_presence_of :human_name }
  it { should validate_uniqueness_of :name_key }
  it { should validate_uniqueness_of :icon_file }
  it { should validate_uniqueness_of :human_name }
  it { should have_many :lesson_plans }
end
