class PodcastsController < ApplicationController
  before_action :set_js_packs, :only => :index

  def index
  end

  private
  def set_js_packs
    self.js_packs = ['podcasts']
  end
end

