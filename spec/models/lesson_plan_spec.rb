require 'rails_helper'

RSpec.describe LessonPlan, type: :model do
  it { should validate_presence_of :theme }
  it { should belong_to(:theme).class_name("LessonPlanTheme") }
  it { should validate_presence_of :name_key }
  it { should validate_presence_of :objective_keys }
  it { should serialize(:objective_keys).as(Array) }
  it { should validate_presence_of :desc_key }
  it { should validate_presence_of :grade_level }
  it { should belong_to(:grade_level).class_name("LessonPlanGradeLevel") }
  it { should have_and_belong_to_many(:perks).class_name("LessonPlanPerk") }
  it { should validate_uniqueness_of(:human_name).scoped_to(:grade_level_id) }

  describe "a lesson plan should have a file_name or an external_url but not both" do
    let(:lesson) { create(:lesson_plan) }

    context "when only a file_name is present" do 
      it "should be valid" do
        lesson.external_url = nil
        lesson.file_name = "foo.pdf"
        expect(lesson).to be_valid
      end
    end

    context "when only an external_url is present" do
      it "should be valid" do
        lesson.external_url = "www.foo.com"
        lesson.file_name = nil
        expect(lesson).to be_valid
      end
    end

    context "when both a file_name and an external_url are present" do 

      it "should be invalid" do
        lesson.external_url = "www.foo.com"
        lesson.file_name = "foo.pdf"
        expect(lesson).to be_invalid
      end
    end

    context "when neither a file_name nor an external_url are present" do
      it "should be invalid" do
        lesson.external_url = nil
        lesson.file_name = nil
        expect(lesson).to be_invalid
      end
    end
  end 
end
