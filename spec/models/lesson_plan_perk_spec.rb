require 'rails_helper'

RSpec.describe LessonPlanPerk, type: :model do
  it { should validate_presence_of :name_key }
  it { should validate_presence_of :icon_name }
  it { should validate_uniqueness_of :name_key }
  it { should validate_uniqueness_of :icon_name }
end
