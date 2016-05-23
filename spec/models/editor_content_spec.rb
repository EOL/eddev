require 'rails_helper'

RSpec.describe EditorContent, type: :model do
  it { should validate_presence_of :locale }
  it { should validate_presence_of :key }
  it { should validate_presence_of :value }

  it { should belong_to :editor_content_owner }

  describe "valid instance" do
    let(:content) { create(:editor_content) }

    it "is valid" do
      expect(content).to be_valid
    end

    it "has a key with no whitespace" do
      content.key = "my key"
      expect(content).to be_invalid
    end
  end 

  context "when an update is attempted" do
    let(:content) { create(:editor_content) }

    it "fails" do
      content.value = content.value + "extra stuff"  
      expect(content.save).to be false
    end 
  end
end
