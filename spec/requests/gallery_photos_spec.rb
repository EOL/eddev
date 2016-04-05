require 'rails_helper'

RSpec.describe "GalleryPhotos", type: :request do
  describe "GET /gallery_photos" do
    it "works! (now write some real specs)" do
      get gallery_photos_path
      expect(response).to have_http_status(200)
    end
  end
end
