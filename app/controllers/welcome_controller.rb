class WelcomeController < ApplicationController
  def index
    @hero_image_partial = "welcome/slideshow"
  end

  def about
  end
end
