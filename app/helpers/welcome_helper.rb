module WelcomeHelper
  def nav_image(image_name) 
    return image_tag "welcome/nav/#{image_name}.jpg",
      :class => "nav-img"
  end
end
