module WelcomeHelper
  def nav_image(image_name) 
    return image_tag "welcome/nav/#{image_name}.jpg",
      :class => "nav-img"
  end

  def slide_image_path(image_name)
    path = image_path "welcome/slides/#{image_name}.jpg"
    return "url(#{path})"
  end
end
