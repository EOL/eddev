require 'rails_helper'

RSpec.describe Habitat, type: :model do
  let(:habitat) { create(:habitat) }

  it { should belong_to :place }
  it { should validate_presence_of :place_id }

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
        expect(habitat.locales_with_content.empty?).to be true
      end
    end 

    describe "when there is one locale with content" do
      before { EditorContent.create!(key: habitat.content_key(:h1), value: "some value", locale: "es") }

      it "returns an array containing that locale" do
        expect(habitat.locales_with_content).to eq(["es"])
      end
    end

    describe "when there are multiple locales with content" do
      before { EditorContent.create!(key: habitat.content_key(:h1), value: "some value", locale: "es") }
      before { EditorContent.create!(key: habitat.content_key(:h1), value: "some value", locale: "fr") }
      before { EditorContent.create!(key: habitat.content_key(:h1), value: "some value", locale: "en") }

      it "returns an array containing those locales in alphabetical order" do
        expect(habitat.locales_with_content).to eq(["en", "es", "fr"])
      end
    end
  end

  describe "#content_key" do
    describe "when it is called with a valid key" do
      it "returns the correct content key" do
        expect(habitat.content_key(:h1)).to eq("habitat_h1_#{habitat.id}")
      end
    end

    describe "when it is called with an invalid key" do
      it "raises ArgumentError" do
        expect{habitat.content_key(:bogus)}.to raise_error(ArgumentError)
      end
    end
  end

  describe "#copy_locale_contents" do
    let (:content_value) { "content value"}
    before { EditorContent.create!(key: habitat.content_key(:h1), value: content_value, locale: "es") }
    before { EditorContent.create!(key: habitat.content_key(:p1), value: content_value, locale: "fr") }
    before { EditorContent.create!(key: habitat.content_key(:h1), value: content_value, locale: "en") } 
    
    let(:other_place) { create(:place, name: "other place")}
    let(:other_habitat) { create(:habitat, name: "other habitat", place: other_place) }

    describe "when it is called with no locales" do
      it "doesn't copy anything" do
        before_count = EditorContent.count
        habitat.copy_locale_contents!(other_habitat, [])
        expect(EditorContent.count).to eq(before_count)
      end
    end

    describe "when it is called with one locale" do
      it "copies content for that locale" do
        before_count = EditorContent.count

        habitat.copy_locale_contents!(other_habitat, ["es"])
        copied_content = EditorContent.find_by(key: other_habitat.content_key(:h1), locale: "es")
        
        expect(copied_content).not_to be_nil
        expect(copied_content.value).to eq(content_value)

        expect(EditorContent.count).to eq(before_count + 1)
      end
    end

    describe "when it is called with multiple locales" do
      it "copies content for those locales" do
        before_count = EditorContent.count

        habitat.copy_locale_contents!(other_habitat, ["es", "fr"])

        es_h1 = EditorContent.find_by(key: other_habitat.content_key(:h1), locale: "es")
        expect(es_h1).not_to be_nil
        expect(es_h1.value).to eq(content_value)

        fr_p1 = EditorContent.find_by(key: other_habitat.content_key(:p1), locale: "fr")
        expect(fr_p1).not_to be_nil
        expect(fr_p1.value).to eq(content_value)

        expect(EditorContent.count).to eq(before_count + 2)
      end
    end
  end
end
