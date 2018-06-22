class EarthToursController < ApplicationController
  def index
    @tours = EarthTour.all
  end
end
