class Deck < ActiveRecord::Base
  validates_presence_of :title_key
  validates_presence_of :subtitle_key
  validates_presence_of :desc_key
  validates_presence_of :file_name
  validates_uniqueness_of :file_name
  validates_presence_of :thumbnail_file_name
  validates_uniqueness_of :thumbnail_file_name
  validates_uniqueness_of :human_name, :allow_nil => true
end
