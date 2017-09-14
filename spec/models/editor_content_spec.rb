# require 'rails_helper'
#
# RSpec.describe EditorContent, type: :model do
#   it { should validate_presence_of :key }
#   it { should validate_presence_of :value }
#   it { should validate_presence_of :content_model_state }
#   it { should validate_presence_of :version }
#   it { should validate_numericality_of(:version).is_greater_than_or_equal_to(0) }
#
#   context "when an update is attempted" do
#     let(:content) { create(:editor_content) }
#
#     it "fails" do
#       content.value = content.value + "extra stuff"
#       expect(content.save).to be false
#     end
#   end
# end
