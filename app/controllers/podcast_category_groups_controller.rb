class PodcastCategoryGroupsController < ApplicationController
  def index
    render json: PodcastCategoryGroup.all.includes(:categories), 
      include: :categories
  end
end

