require 'rails_helper'

RSpec.describe "gallery_photos/edit", type: :view do
  before(:each) do
    @gallery_photo = assign(:gallery_photo, GalleryPhoto.create!())
  end

  it "renders the edit gallery_photo form" do
    render

    assert_select "form[action=?][method=?]", gallery_photo_path(@gallery_photo), "post" do
    end
  end
end
