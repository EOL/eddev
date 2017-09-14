# require 'rails_helper'
#
# RSpec.describe ContentModelState, type: :model do
#   it { should validate_presence_of :content_model }
#   it { should validate_presence_of :editor_content_version }
#   it { should validate_numericality_of(:editor_content_version).is_greater_than_or_equal_to(0) }
#   it { should validate_presence_of :locale }
#   it { should belong_to :content_model }
#
#   it "should validate uniqueness of content_model_id scoped to content_model_type and locale" do
#     content_model = create(:habitat)
#
#     state = ContentModelState.new(
#       :content_model => content_model,
#       :editor_content_version => 0,
#       :published => false,
#       :locale => :en
#     )
#     expect(state.save).to eq(true)
#
#     invalid_state = ContentModelState.new(
#       :content_model => content_model,
#       :editor_content_version => 1,
#       :published => true,
#       :locale => :en
#     )
#     expect(invalid_state).to be_invalid
#
#     valid_state_different_locale = ContentModelState.new(
#       :content_model => content_model,
#       :editor_content_version => 1,
#       :published => true,
#       :locale => :es
#     )
#     expect(valid_state_different_locale).to be_valid
#   end
#
#   describe "default attribute values" do
#     let(:content_model) { build_stubbed(:habitat) }
#     let(:state) { ContentModelState.new(:content_model => content_model, :locale => :en) }
#
#     it "sets defaults so that it is valid" do
#       expect(state).to be_valid
#     end
#
#     it "sets published to false" do
#       expect(state.published).to eq(false)
#     end
#
#     it "sets editor_content_version to 0" do
#       expect(state.editor_content_version).to eq(0)
#     end
#
#     it "doesn't set defaults if it has been persisted" do
#       state.save
#       state.published = nil
#       expect(state).to be_invalid
#
#       state.published = true
#       expect(state).to be_valid
#
#       state.editor_content_version = nil
#       expect(state).to be_invalid
#     end
#   end
# end
