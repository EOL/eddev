class SinglePageContentModel < ActiveRecord::Base
  include ContentModel
  validates :page_name, :presence => true, :uniqueness => true
end
