require 'rails_helper'

RSpec.describe EditorContent, type: :model do
  describe "valid instance" do
    let(:content) { create(:editor_content) }

    it "is valid" do
      expect(content).to be_valid
    end

    it "has a key" do
      content.key = nil
      expect(content).to be_invalid
    end

    it "has a value" do
      content.value = nil
      expect(content).to be_invalid
    end
  end 

  describe "#save" do
    let(:content) { build(:editor_content) }

    context "when I18n.locale isn't the default" do
      let(:locale) { "es" }

      before(:each) do
        I18n.locale = locale
      end

      after(:each) do
        I18n.locale = I18n.default_locale
      end

      it "sets the locale to I18n.locale" do
        content.save!
        expect(content.locale).to eq(locale)  
      end
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
