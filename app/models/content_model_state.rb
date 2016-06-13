class ContentModelState < ActiveRecord::Base
  belongs_to :content_model, polymorphic: true
  has_many :editor_contents

  validates_presence_of :content_model
  validates_uniqueness_of :content_model_id, :scope => [:content_model_type, :locale]
  validates :published, :inclusion => { :in => [true, false] }
  validates :editor_content_version, :presence => true, 
    :numericality => { :greater_than_or_equal_to => 0 }
  validates_presence_of :locale

  after_initialize :set_defaults, :unless => :persisted?

  def create_content!(key, value)
    editor_contents.create!(
      :key => key,
      :value => value, 
      :version => version_for_new_values
    )
  end

  def content_value(key)
    content_value_helper(editor_contents.where(:key => key)
                                    .where("version <= #{editor_content_version}")
                                    .order(:created_at => :desc)
                                    .limit(1), key)
  end

  def draft_content_value(key)
    content_value_helper(editor_contents.where(:key => key)
                                  .order(:created_at => :desc)
                                  .limit(1), key)
  end

  def publish_draft
    if has_unpublished_content?
      self.editor_content_version += 1
      self.save!
    end
  end
  
  def has_unpublished_content?
    max_version = editor_contents.maximum(:version)
    max_version > editor_content_version
  end

  def self.find_or_create!(options)
    base_options = HashWithIndifferentAccess.new(locale: nil)

    # If content_model is set, don't set defaults for these attributes since they will
    # result in duplicate query parameters
    if !options.key?(:content_model)
      base_options.merge!({content_model_id: nil, content_model_type: nil}) 
    end

    base_options.merge!(options) 
    self.where(base_options).first_or_create!
  end

  private
  def version_for_new_values
    editor_content_version + 1
  end

  def set_defaults
    self.published = false if published.nil?
    self.editor_content_version = 0 if editor_content_version.nil?
  end

  def content_value_helper(query_result, key)
    value = query_result.empty? ? key : query_result[0].value
  end
end
