require 'rails_helper'

RSpec.describe Habitat, type: :model do
  let(:habitat) { create(:habitat) }

  it { should belong_to :place }
  it { should validate_presence_of :place_id }

  it_behaves_like "content_model"

  describe "valid instance" do
    it "is valid" do
      expect(habitat).to be_valid
    end
  end
end
