require 'rails_helper'

RSpec.describe "gallery_photos/show", type: :view do
  before(:each) do
    @gallery_photo = assign(:gallery_photo, GalleryPhoto.create!())
  end

  it "renders attributes in <p>" do
    render
  end
end
