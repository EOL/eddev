require 'rails_helper'

RSpec.describe Place, type: :model do
  it { should have_many :habitats }
  it { should have_many :editor_content_keys }
  it { should have_many :content_model_states }

  describe "valid instance" do
    let(:place) { create(:place) }

    it "is valid" do
      expect(place).to be_valid
    end

    it "has a name" do
      place.name = ''
      expect(place).to be_invalid 
    end

    it "has a unique name" do
      other_place = Place.new(name: place.name)
      expect(other_place).to be_invalid
    end
  end
end
