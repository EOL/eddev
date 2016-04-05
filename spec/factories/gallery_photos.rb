FactoryGirl.define do
  factory :gallery_photo do
    image File.new("spec/assets/images/laughing_dove.jpg")     
    author "Photo Contributor"
    caption "Photo Caption"
    gallery
  end
end
