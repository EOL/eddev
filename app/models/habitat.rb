require 'set'

class Habitat < ActiveRecord::Base
  include EditorContentHelper
  
  validates :name, presence: true, uniqueness: true
  validates_presence_of :place_id
  belongs_to :place
  
  H1_KEY_PREFIX = "habitat_h1_"
  
  def h1_key
    raise "h1_key cannot be called on a Habitat that doesn't have an id" unless id 
    
    return "#{H1_KEY_PREFIX}#{id}"
  end
  
  def copy(place, locales = [I18n.locale])
    new_habitat = Habitat.create!(name: "#{name} (copy)", place: place)
    
    # Copy over EditorContents
    locales.each do | locale |
      copy_value_if_exists(h1_key, new_habitat.h1_key, locale)
    end
    
    return new_habitat
  end
  
  def locales_with_content
    contents = EditorContent.where(key: content_keys)
    locale_set = Set.new
    locale_list = []

    contents.each do |content|
      if !locale_set.include?(content.locale)
        locale_list.push(content.locale)
        locale_set.add(content.locale)
      end
    end

    locale_list.sort!
    return locale_list
  end

  private
  def content_keys
    if id
      return [h1_key]
    else
      return []
    end
  end
end
