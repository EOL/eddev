FactoryGirl.define do
  factory :gallery_photo do
    image File.new("spec/assets/images/laughing_dove.jpg")     
    caption "Photo Caption"
    rights_holder "Rights Holder"
    source "EOL"
    gallery
    license
  end
end
