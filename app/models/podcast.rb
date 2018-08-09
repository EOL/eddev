class Podcast < ApplicationRecord
  validates :title, { presence: true, uniqueness: true }
  validates :description, { presence: true, uniqueness: true }
  validates :image_file_name, { presence: true, uniqueness: true }
  validates :audio_file_name, { presence: true, uniqueness: true }
  validates :eol_page_id, { presence: true }
  validates :perm_id, { presence: true, uniqueness: true }
  validates :sci_name, { presence: true }

  has_and_belongs_to_many :categories, join_table: :podcasts_to_categories, class_name: "PodcastCategory"
end
