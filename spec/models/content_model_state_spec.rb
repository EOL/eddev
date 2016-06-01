require 'rails_helper'

RSpec.describe ContentModelState, type: :model do
  it { should validate_presence_of :content_model }
  it { should validate_presence_of :editor_content_version }

  describe "default attribute values" do 
    let(:content_model) { build_stubbed(:habitat) }
    let(:state) { ContentModelState.new(:content_model => content_model) }

    it "sets defaults so that it is valid" do
      expect(state).to be_valid
    end

    it "sets published to false" do
      expect(state.published).to eq(false)
    end

    it "sets editor_content_version to 0" do
      expect(state.editor_content_version).to eq(0)
    end

    it "doesn't set defaults if it has been persisted" do
      state.save
      state.published = nil
      expect(state).to be_invalid

      state.published = true
      expect(state).to be_valid

      state.editor_content_version = nil
      expect(state).to be_invalid
    end
  end
end
