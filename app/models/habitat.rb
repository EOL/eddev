require 'set'

class Habitat < ActiveRecord::Base
  include EditorContentHelper
  
  validates :name, presence: true, uniqueness: true
  validates_presence_of :place_id

  belongs_to :place
  has_many :editor_content_keys, as: :content_model

  after_initialize :init_content_key_cache
  
  H1_KEY_PREFIX = "habitat_h1_"
  P1_KEY_PREFIX = "habitat_p1_"

  CONTENT_KEY_PREFIXES = {
    h1: "habitat_h1_",
    p1: "habitat_p1_",
  }
  private_constant :CONTENT_KEY_PREFIXES 

  def h1_key
    content_key(:h1)
  end

  def content_key(key)
    raise no_id_error_msg('content_key') unless id

    content_key_prefix = CONTENT_KEY_PREFIXES[key]
    raise ArgumentError.new("Invalid key") unless content_key_prefix

    content_key_cache[key] ||= "#{content_key_prefix}#{id}"
  end
  
  def copy_locale_contents!(habitat, locales)
    keys_to_copy = editor_content_keys.where(locale: locales)
    
    EditorContentKey.transaction do
      copies = keys_to_copy.collect do |key| 
        new_key = EditorContentKey.find_or_create(name: key.name, locale: key.locale, content_model: habitat)
        new_key.build_value(key.latest_value)
      end

      copies.each do |copy|
        copy.save!
      end
    end
  end
  
  # Precisely, this method returns the locales for which there exist at least one
  # EditorContentKey. In practice, this should be good enough, since EditorContentKeys
  # are generally created on-demand; that is, we expect there to exist at least one value per key.
  def locales_with_content
    keys = editor_content_keys.group(:locale).order(:locale)
    keys.collect { |c| c.locale }
  end

  def self.all_ordered_alpha_with_place
    includes(:place).order('places.name').order(:name)
  end

  private
  def all_content_keys
    @all_content_keys ||= CONTENT_KEY_PREFIXES.keys.collect { |key| content_key key }
  end

  def init_content_key_cache
    # To lazily cache content keys
    @content_keys = {}
  end   

  def content_key_cache
    @content_keys
  end
end
