module ContentModel
  extend ActiveSupport::Concern
  
  included do 
    has_many :editor_content_keys, :as => :content_model
  end
end
