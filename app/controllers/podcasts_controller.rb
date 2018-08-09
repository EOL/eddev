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
            image_path: view_context.image_path("podcasts/#{podcast.image_file_name}"),
            audio_path: "podcasts/#{podcast.audio_file_name}",
            transcript_path: 
              (
                podcast.transcript_file_name ? 
                "podcasts/#{podcast.transcript_file_name}" : 
                nil
              ),
            eol_page_id: podcast.eol_page_id,
            lesson_plan_url: podcast.lesson_plan_url,
            perm_id: podcast.perm_id,
            sci_name: podcast.sci_name,
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

