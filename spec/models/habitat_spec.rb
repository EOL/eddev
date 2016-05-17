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

    describe "when there exist values for h1_key" do
      let(:h1_value) { "Header value" }
      before { EditorContent.create!(key: habitat.h1_key, value: h1_value, locale: "en") }
      before { EditorContent.create!(key: habitat.h1_key, value: h1_value, locale: "es") }
      before { EditorContent.create!(key: habitat.h1_key, value: h1_value, locale: "fr") }


      describe "when it is called with no locales" do # XXX: not implemented yet, but consider supporting specifying list of locales to copy
        before { I18n.locale = "es" }
        let(:habitat_copy) { habitat.copy }

        it_behaves_like :valid_copy

        it "copies the contents for the current locale" do
          contents = EditorContent.where(key: habitat_copy.h1_key)
          expect(contents).not_to be nil
          expect(contents.length).to eq 1
          expect(contents[0].locale).to eq I18n.locale.to_s
          expect(contents[0].value).to eq h1_value
        end
      end

      describe "when it is called with a list of locales" do
        let(:locales) { ["en", "fr"]}
        let(:habitat_copy) { habitat.copy(locales) }

        it_behaves_like :valid_copy

        it "copies the contents for those locales" do
          contents = EditorContent.order(:locale).where(key: habitat_copy.h1_key)
          expect(contents).not_to be nil
          expect(contents.length).to eq 2

          locales.each_with_index do | locale, i |
            content = contents[i]

            expect(content.locale).to eq locale
            expect(content.value).to eq h1_value
          end          
        end
      end
    end
  end
end
