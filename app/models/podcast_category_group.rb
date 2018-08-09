class PodcastCategoryGroup < ApplicationRecord
  validates :name, uniqueness: true, presence: true
  has_many :categories, class_name: "PodcastCategory", inverse_of: :group, foreign_key: "group_id"
end
