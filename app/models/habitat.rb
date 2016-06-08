require 'set'

class Habitat < ActiveRecord::Base
  include EditorContentHelper
  include ContentModel 

  belongs_to :place

  validates :name, presence: true, uniqueness: true
  validates_presence_of :place_id

  def copy_locale_contents!(habitat, locales)
    keys_to_copy = editor_content_keys.where(locale: locales)
    
    EditorContentKey.transaction do
      keys_to_copy.each do |key| 
        new_key = EditorContentKey.find_or_create!(name: key.name, locale: key.locale, content_model: habitat)
        new_key.create_value!(key.latest_value)
      end
    end
  end
  
  def self.all_ordered_alpha_with_place
    includes(:place).order('places.name').order(:name)
  end
end
