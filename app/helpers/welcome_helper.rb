module WelcomeHelper
  def nav_image(image_name) 
    return image_tag "welcome/nav/#{image_name}.jpg",
      :class => "nav-img"
  end

  def slide_image_path(image_name)
    "welcome/slides/#{image_name}.jpg"
  end

  def small_slide_image_path(image_name)
    "welcome/slides/#{image_name}_sm.jpg"
  end
end
