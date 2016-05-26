require 'rails_helper'

RSpec.describe EditorContentValue, type: :model do
  it { should validate_presence_of :content }
  it { should validate_presence_of :editor_content_key }

  context "when an update is attempted" do
    let(:content_value) { create(:editor_content_value) }

    it "fails" do
      content_value.content = content_value.content + "extra stuff"
      expect(content_value.save).to be false
    end
  end
end
