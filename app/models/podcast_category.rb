class PodcastCategory < ApplicationRecord
  validates name: { presence: true, uniqueness: true }
  validates perm_id: { presence: true, uniqueness: true }
  validates_presence_of :group

  has_and_belongs_to_many :podcasts, join_table: :podcasts_to_categories

  enum group: {
    skills: 0,
    themes: 1,
    taxon_groups: 2
  }
end
