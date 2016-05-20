require 'set'

class Habitat < ActiveRecord::Base
  include EditorContentHelper
  
  validates :name, presence: true, uniqueness: true
  validates_presence_of :place_id
  belongs_to :place
  
  H1_KEY_PREFIX = "habitat_h1_"
  P1_KEY_PREFIX = "habitat_p1_"
  
  # EditorContent key methods
  # !!!!!!!IMPORTANT!!!!!! update content_keys with any new content key methods, otherwise copy_locale_contents won't 
  # pick it up.
  def h1_key
    content_key(H1_KEY_PREFIX, 'h1_key', @h1_key)
  end

  def p1_key
    content_key(P1_KEY_PREFIX, 'p1_key', @p1_key)
  end
  
  def copy_locale_contents!(habitat, locales = [I18n.locale])
    # Since locales is an array, keep track of what we've already copied in case there are duplicates.
    # This function doesn't take a Set for locales for iteration's sake. It shouldn't be hard for clients to 
    # pass in unique values, so this is just a safeguard, but one that is necessary to prevent dupliacte rows in the
    # EditorContents table.
    copied_locales = Set.new 

    # Copy over EditorContents
    locales.each do | locale |
      if !copied_locales.include?(locale)
        content_to_copy = EditorContent.find_by(key: h1_key, locale: locale)

        if content_to_copy
          content_to_copy.copy(habitat.h1_key).save!
        end
      end

      copied_locales.add(locale)
    end
  end
  
  def locales_with_content
    contents = EditorContent.where(key: content_keys).group(:locale).order(:locale)
    contents.collect { |c| c.locale }
  end

  def self.all_ordered_alpha_with_place
    includes(:place).order('places.name').order(:name)
  end

  private
  def content_keys
    if id
      return [h1_key, p1_key]
    else
      return []
    end
  end

  def raise_unless_id(method_name)
    raise no_id_error_msg(method_name) unless id 
  end

  def no_id_error_msg(method_name)
    "#{method_name} cannot be called on a Habitat that doesn't have an id"
  end

  def build_content_key(prefix, cache_var)
    cache_var ||= "#{prefix}#{id}"
  end

  def content_key(prefix, method_name, cache_var)
    raise_unless_id(method_name)
    build_content_key(prefix, cache_var)
  end
end
