class Podcast < ApplicationRecord
  #validates :title, { presence: true, uniqueness: true }
  #validates :description, { presence: true, uniqueness: true }
  #validates :image_file_name, { presence: true }
  #validates :audio_file_name, { presence: true, uniqueness: true }
  #validates :eol_url, { presence: true }
  validates :perm_id, { presence: true, uniqueness: true }
  #validates :sci_name, { presence: true }

  has_and_belongs_to_many :categories, join_table: :podcasts_to_categories, class_name: "PodcastCategory"

  def self.seed
    self.delete_all
    data = []
    categories = PodcastCategory.all.map do |cat|
      [cat.name.downcase, cat]
    end.to_h

    CSV.foreach(Rails.root.join("db/seed_data/podcasts.tsv"), col_sep: "\t", headers: true) do |line|
      line_cats = []

      line_cats << categories[line["taxon_group"]] if line["taxon_group"]
      line_cats << categories[line["skill"]] if line["skill"]
      line_cats << categories[line["theme"]] if line["theme"]

      data << ({
        title: line["title"],
        description: line["description"],
        image_file_name: line["image_file_name"],
        audio_file_name: line["audio_file_name"],
        transcript_file_name: line["transcript_file_name"],
        lesson_plan_url: line["lesson_plan_url"],
        perm_id: line["perm_id"],
        sci_name: line["sci_name"],
        eol_url: line["eol_url"],
        categories: line_cats.compact
      })
    end
    Podcast.create!(data)
  end
end
