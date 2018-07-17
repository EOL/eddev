class PodcastsController < ApplicationController
  before_action :disable_main_col
  before_action :main_nopad_bot
  before_action :set_js_packs, :only => :index

  def index
  end

  private
  def set_js_packs
    self.js_packs = ['podcasts']
  end
end

