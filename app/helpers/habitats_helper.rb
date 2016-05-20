module HabitatsHelper
  def place_habitat_name(habitat)
    "#{habitat.place.name}/#{habitat.name}"
  end

  def locales_with_content_string(habitat)
    habitat.locales_with_content.join ','
  end 
end