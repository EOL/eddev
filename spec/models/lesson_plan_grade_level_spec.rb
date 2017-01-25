require 'rails_helper'

RSpec.describe LessonPlanGradeLevel, type: :model do
  it { should validate_presence_of :name_key }
  it { should validate_uniqueness_of :name_key }
end
