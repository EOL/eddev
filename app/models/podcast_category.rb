class PodcastCategory < ApplicationRecord
  validates :name, { presence: true, uniqueness: true }
  validates :perm_id, { presence: true, uniqueness: true }
  validates_presence_of :group
  has_and_belongs_to_many :podcasts, 
    join_table: :podcasts_to_categories,
    inverse_of: :categories
  belongs_to :group, class_name: "PodcastCategoryGroup", inverse_of: :categories
end
