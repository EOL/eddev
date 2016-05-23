module HabitatsHelper
  def place_habitat_name(habitat)
    "#{habitat.place.name}/#{habitat.name}"
  end
end
