require 'rails_helper'

describe GalleryPhoto do
  describe "valid instance" do
    let(:photo) { create(:gallery_photo) }

    it "is valid" do
      expect(photo).to be_valid
    end

    it "has an image" do
      photo.image = nil
      expect(photo).to be_invalid
    end

    it "has an author" do
      photo.author = nil
      expect(photo).to be_invalid
    end

    it "has a caption" do
      photo.caption = nil
      expect(photo).to be_invalid
    end

    it "has a gallery" do
      photo.gallery = nil
      expect(photo).to be_invalid
    end
  end
end
