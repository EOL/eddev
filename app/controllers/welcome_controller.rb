class WelcomeController < ApplicationController
  def index
    @hero_image_partial = "welcome/slideshow"
  end

  def about
    @hero_image_partial = "welcome/about_hero"
  end
end
