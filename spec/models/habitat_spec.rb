require 'rails_helper'

RSpec.describe Habitat, type: :model do
#  let(:habitat) { create(:habitat) }
#
#  it { should belong_to :place }
#  it { should validate_presence_of :place_id }
#  it { should validate_presence_of :name }
#  it { should validate_uniqueness_of :name }
#  it { should have_many :editor_content_keys }
#
#  describe "valid instance" do
#    it "is valid" do
#      expect(habitat).to be_valid
#    end
#  end
#
#  describe "#locales_with_content" do
#    describe "when there are no locales with content" do
#      it "returns an empty array" do
#        expect(habitat.locales_with_content.empty?).to be true
#      end
#    end 
#
#    describe "when there is one locale with content" do
#      before { EditorContent.create!(key: habitat.content_key(:h1), value: "some value", locale: "es") }
#
#      it "returns an array containing that locale" do
#        expect(habitat.locales_with_content).to eq(["es"])
#      end
#    end
#
#    describe "when there are multiple locales with content" do
#      before { EditorContent.create!(key: habitat.content_key(:h1), value: "some value", locale: "es") }
#      before { EditorContent.create!(key: habitat.content_key(:h1), value: "some value", locale: "fr") }
#      before { EditorContent.create!(key: habitat.content_key(:h1), value: "some value", locale: "en") }
#
#      it "returns an array containing those locales in alphabetical order" do
#        expect(habitat.locales_with_content).to eq(["en", "es", "fr"])
#      end
#    end
#  end
#
#  describe "#content_key" do
#    describe "when it is called with a valid key" do
#      it "returns the correct content key" do
#        expect(habitat.content_key(:h1)).to eq("habitat_h1_#{habitat.id}")
#      end
#    end
#
#    describe "when it is called with an invalid key" do
#      it "raises ArgumentError" do
#        expect{habitat.content_key(:bogus)}.to raise_error(ArgumentError)
#      end
#    end
#  end
#
#  describe "#copy_locale_contents!" do
#    let (:content_value) { "content value"}
#
#    before { EditorContent.create!(key: :h1, value: content_value, locale: "es", editor_content_owner: habitat) }
#    before { EditorContent.create!(key: :p1, value: content_value, locale: "fr", editor_content_owner: habitat) }
#    before { EditorContent.create!(key: :h1, value: content_value, locale: "en", editor_content_owner: habitat) } 
#    
#    let(:other_place) { create(:place, name: "other place")}
#    let(:other_habitat) { create(:habitat, name: "other habitat", place: other_place) }
#
#    describe "when it is called with no locales" do
#      it "doesn't copy anything" do
#        before_count = EditorContent.count
#        habitat.copy_locale_contents!(other_habitat, [])
#        expect(EditorContent.count).to eq(before_count)
#      end
#    end
#
#    describe "when it is called with one locale" do
#      it "copies content for that locale" do
#        before_count = EditorContent.count
#
#        habitat.copy_locale_contents!(other_habitat, ["es"])
#        other_habitat.reload 
#        
#        expect(other_habitat.editor_contents.length).to eq(1)
#        expect(other_habitat.editor_contents[0].value).to eq(content_value)
#      end
#    end
#
#    describe "when it is called with multiple locales" do
#      it "copies content for those locales" do
#        habitat.copy_locale_contents!(other_habitat, ["es", "fr"])
#        other_habitat.reload
#
#        expect(other_habitat.editor_contents.length).to eq(2)
#
#        es_contents = other_habitat.editor_contents.where(locale: :es, key: :h1, value: content_value)
#        expect(es_contents.length).to eq(1)
#
#        fr_contents = other_habitat.editor_contents.where(locale: :fr, key: :p1, value: content_value)
#        expect(fr_contents.length).to eq(1)
#      end
#    end
#  end
end
