class Place < ActiveRecord::Base
  include ContentModel

  validates :name, presence: true, uniqueness: true
  has_many :habitats
  has_many :content_model_states, :as => :content_model
end
