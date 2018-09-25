class PodcastImage < ApplicationRecord
  belongs_to :podcast
  validates :file_name, uniqueness: true, presence: true
end
