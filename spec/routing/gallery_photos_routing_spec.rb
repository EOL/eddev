require "rails_helper"

RSpec.describe GalleryPhotosController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/gallery_photos").to route_to("gallery_photos#index")
    end

    it "routes to #new" do
      expect(:get => "/gallery_photos/new").to route_to("gallery_photos#new")
    end

    it "routes to #show" do
      expect(:get => "/gallery_photos/1").to route_to("gallery_photos#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/gallery_photos/1/edit").to route_to("gallery_photos#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/gallery_photos").to route_to("gallery_photos#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/gallery_photos/1").to route_to("gallery_photos#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/gallery_photos/1").to route_to("gallery_photos#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/gallery_photos/1").to route_to("gallery_photos#destroy", :id => "1")
    end

  end
end
