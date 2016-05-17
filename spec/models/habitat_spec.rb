require 'rails_helper'

RSpec.describe Habitat, type: :model do
  let(:habitat) { create(:habitat) }

  describe "valid instance" do
    it "is valid" do
      expect(habitat).to be_valid
    end

    it "has a name" do
      habitat.name = ''
      expect(habitat).to be_invalid
    end

    it "has a unique name" do
      other_habitat = Habitat.new(name: habitat.name)
      expect(other_habitat).to be_invalid
    end
  end

  describe "#locales_with_content" do
    describe "when there are no locales with content" do
      it "returns an empty array" do
        expect(habitat.locales_with_content).to eq([])
      end
    end 

    describe "when there is one locale with content" do
      before { EditorContent.create!(key: habitat.h1_key, value: "some value", locale: "es") }

      it "returns an array containing that locale" do
        expect(habitat.locales_with_content).to eq(["es"])
      end
    end

    describe "when there are multiple locales with content" do
      before { EditorContent.create!(key: habitat.h1_key, value: "some value", locale: "es") }
      before { EditorContent.create!(key: habitat.h1_key, value: "some value", locale: "fr") }
      before { EditorContent.create!(key: habitat.h1_key, value: "some value", locale: "en") }

      it "returns an array containing those locales in alphabetical order" do
        expect(habitat.locales_with_content).to eq(["en", "es", "fr"])
      end
    end
  end

  describe "#copy" do
    shared_examples_for :valid_copy do
      it "returns a valid instance" do
        expect(habitat_copy).to be_valid
      end      

      it "sets the name correctly" do
        expect(habitat_copy.name).to eq habitat.name + " (copy)"
      end
    end

    describe "when there exists a value for h1_key" do
      let(:h1_value) { "Header value" }
      before { EditorContent.create!(key: habitat.h1_key, value: h1_value, locale: I18n.default_locale) }
      let(:habitat_copy) { habitat.copy }

      it_behaves_like :valid_copy
    end
  end
end
