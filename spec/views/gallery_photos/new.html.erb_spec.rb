require 'rails_helper'

RSpec.describe "gallery_photos/new", type: :view do
  before(:each) do
    assign(:gallery_photo, GalleryPhoto.new())
  end

  it "renders new gallery_photo form" do
    render

    assert_select "form[action=?][method=?]", gallery_photos_path, "post" do
    end
  end
end
