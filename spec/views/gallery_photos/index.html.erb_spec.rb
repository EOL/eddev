require 'rails_helper'

RSpec.describe "gallery_photos/index", type: :view do
  before(:each) do
    assign(:gallery_photos, [
      GalleryPhoto.create!(),
      GalleryPhoto.create!()
    ])
  end

  it "renders a list of gallery_photos" do
    render
  end
end
