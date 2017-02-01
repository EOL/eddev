class Deck < ActiveRecord::Base
  include LocalizedContent

  validates_presence_of :title_key
  validates_presence_of :desc_key
  validates_presence_of :file_name
  validates_uniqueness_of :file_name
  validates_presence_of :image_file_name
  validates_uniqueness_of :image_file_name
  validates_uniqueness_of :human_name, :allow_nil => true

  has_content_keys :title, :subtitle, :desc
end
