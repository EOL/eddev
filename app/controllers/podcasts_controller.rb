class PodcastsController < ApplicationController
  before_action :disable_main_col
  before_action :main_nopad_bot

  def index
    @podcasts = Podcast.all.includes(:categories).map do |podcast|
      {
        title: podcast.title,
        description: podcast.description,
        imagePath: view_context.image_path("podcasts/#{podcast.image_file_name}"),
        audioPath: "podcasts/#{podcast.audio_file_name}",
        transcriptPath: 
          (
            podcast.transcript_file_name ? 
            "podcasts/#{podcast.transcript_file_name}" : 
            nil
          ),
        eolUrl: podcast.eol_url,
        lessonPlanUrl: podcast.lesson_plan_url,
        permId: podcast.perm_id,
        sciName: podcast.sci_name,
        categoryIds: podcast.categories.map { |c| c.id }
      }
    end

    @categories_by_id = PodcastCategory.all.map do |c|
      [c.id, c.name]
    end.to_h

    @category_groups = PodcastCategoryGroup.all.map do |g|
      {
        name: g.name,
        categoryIds: g.categories.map { |c| c.id }
      }
    end
  end
end

