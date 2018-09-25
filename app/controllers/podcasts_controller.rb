class PodcastsController < ApplicationController
  before_action :disable_main_col
  before_action :main_nopad_bot

  def index
    @podcasts = Podcast.all.includes([:categories, :image]).map do |podcast|
      {
        title: podcast.title,
        description: podcast.description,
        imagePath: podcast.image_file_name ? view_context.image_path("podcasts/thumbnails/#{podcast.image_file_name}") : nil,
        audioPath: podcast.audio_file_name ? "podcasts/audio/#{podcast.audio_file_name}" : nil,
        transcriptPath: 
          (
            podcast.transcript_file_name ? 
            "podcasts/transcripts/#{podcast.transcript_file_name}" : 
            nil
          ),
        eolUrl: podcast.eol_url,
        lessonPlanUrl: podcast.lesson_plan_url,
        permId: podcast.perm_id,
        sciName: podcast.sci_name,
        categoryIds: podcast.categories.map { |c| c.id },
        image: {
          path: podcast.image.file_name ? view_context.image_path("podcasts/thumbnails/#{podcast.image.file_name}") : nil,
          author: podcast.image.author,
          license: podcast.image.license,
          title: podcast.image.title,
        }
      }
    end

    @categories_by_id = PodcastCategory.all.map do |c|
      [c.id, { name: c.name, desc: c.desc, groupId: c.group.id }]
    end.to_h

    @category_groups = PodcastCategoryGroup.all.map do |g|
      {
        name: g.name,
        categoryIds: g.categories.map { |c| c.id },
        id: g.id,
        iconPath: view_context.image_path("podcasts/icons/#{g.icon_file_name}")
      }
    end
  end
end

