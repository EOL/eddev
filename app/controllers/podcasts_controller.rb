class PodcastsController < ApplicationController
  before_action :disable_main_col
  before_action :main_nopad_bot
  before_action :set_js_packs, :only => :index

  def index
  end

  def all_podcasts_ajax
    podcast_json = Podcast.all.map do |podcast|
      {
        title: podcast.title,
        description: podcast.description,
        image_path: view_context.image_path("podcasts/#{podcast.image_file_name}"),
        audio_file_name: podcast.audio_file_name,
        eol_page_id: podcast.eol_page_id,
        lesson_plan_url: podcast.lesson_plan_url,
        perm_id: podcast.perm_id,
        sci_name: podcast.sci_name,
      }
    end.to_json

    render json: podcast_json
  end

  private
  def set_js_packs
    self.js_packs = ['podcasts']
  end
end

