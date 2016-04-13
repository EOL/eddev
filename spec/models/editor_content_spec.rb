require 'rails_helper'

RSpec.describe EditorContent, type: :model do
  describe "valid instance" do
    let(:content) { create(:editor_content) }

    it "is valid" do
      expect(content).to be_valid
    end

    it "has a locale" do
      content.locale = nil
      expect(content).to be_invalid
    end

    it "has a key" do
      content.key = nil
      expect(content).to be_invalid
    end

    it "has a key with no whitespace" do
      content.key = "my key"
      expect(content).to be_invalid
    end

    it "has a value" do
      content.value = nil
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
