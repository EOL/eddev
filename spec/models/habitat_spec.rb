require 'rails_helper'

RSpec.describe Habitat, type: :model do
  let(:habitat) { create(:habitat) }

  it { should belong_to :place }
  it { should validate_presence_of :place_id }
  it { should validate_presence_of :name }
  it { should validate_uniqueness_of :name }
  it { should have_many :editor_content_keys }
  it { should have_many :content_model_states }

  describe "valid instance" do
    it "is valid" do
      expect(habitat).to be_valid
    end
  end

  describe "#locales_with_content" do
    describe "when there are no locales with content" do
      it "returns an empty array" do
        expect(habitat.locales_with_content.empty?).to be true
      end
    end 

    describe "when there is one locale with content" do
      before do
        create(:editor_content_key, content_model: habitat, locale: :es)
      end

      it "returns an array containing that locale" do
        expect(habitat.locales_with_content).to eq(["es"])
      end
    end

    describe "when there are multiple locales with content" do
      before do
        create(:editor_content_key, content_model: habitat, locale: :es)
        create(:editor_content_key, content_model: habitat, locale: :fr)
        create(:editor_content_key, content_model: habitat, locale: :en)
      end

      it "returns an array containing those locales in alphabetical order" do
        expect(habitat.locales_with_content).to eq(["en", "es", "fr"])
      end
    end
  end

  describe "#copy_locale_contents!" do
    let (:content_value) { "content value"}
    let(:other_place) { create(:place, name: "other place") }
    let(:other_habitat) { create(:habitat, name: "other habitat", place: other_place) }

    before do
      create(:editor_content_key, content_model: habitat, locale: :es).build_value(content_value).save!
      create(:editor_content_key, content_model: habitat, locale: :fr).build_value(content_value).save!
      create(:editor_content_key, content_model: habitat, locale: :en).build_value(content_value).save!    
    end

    describe "when it is called with no locales" do
      it "doesn't copy anything" do
        before_key_count = EditorContentKey.count
        before_val_count = EditorContentValue.count
        habitat.copy_locale_contents!(other_habitat, [])
        expect(EditorContentKey.count).to eq(before_key_count)
        expect(EditorContentValue.count).to eq(before_val_count)
      end
    end

    describe "when it is called with one locale" do
      it "copies content for that locale" do
        habitat.copy_locale_contents!(other_habitat, ["es"])
        other_habitat.reload 
        
        expect(other_habitat.editor_content_keys.length).to eq(1)
        expect(other_habitat.editor_content_keys[0].latest_value).to eq(content_value)
      end
    end

    describe "when it is called with multiple locales" do
      it "copies content for those locales" do
        habitat.copy_locale_contents!(other_habitat, ["es", "fr"])
        other_habitat.reload

        expect(other_habitat.editor_content_keys.length).to eq(2)

        es_keys = other_habitat.editor_content_keys.where(locale: :es)
        expect(es_keys.length).to eq(1)
        expect(es_keys[0].latest_value).to eq(content_value)

        fr_keys = other_habitat.editor_content_keys.where(locale: :fr)
        expect(fr_keys.length).to eq(1)
        expect(fr_keys[0].latest_value).to eq(content_value)
      end
    end
  end
end
