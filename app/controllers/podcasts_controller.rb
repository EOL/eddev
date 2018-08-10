class PodcastsController < ApplicationController
  before_action :disable_main_col
  before_action :main_nopad_bot
  before_action :set_js_packs, :only => :index

  def index
    respond_to do |format|
      format.html {}
      format.json do 
        podcast_json = Podcast.all.includes(:categories).map do |podcast|
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
            eolPageId: podcast.eol_page_id,
            lessonPlanUrl: podcast.lesson_plan_url,
            permId: podcast.perm_id,
            sciName: podcast.sci_name,
            categories: podcast.categories,
          }
        end.to_json

        render json: podcast_json
      end
    end
  end

  private
  def set_js_packs
    self.js_packs = ['podcasts']
  end
end

