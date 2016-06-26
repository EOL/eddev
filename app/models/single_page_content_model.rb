# Content model for single, editable pages that wouldn't otherwise
# have a model.
class SinglePageContentModel < ActiveRecord::Base
  include ContentModel
end
