module PlacesHelper
  def h1_key(place)
    return "places_h1_#{@place.id}"
  end

  def habitats_for_select
    Habitat.all.collect { |h| [h.name, h.id] }
  end

  def habitat_ids(place)
    place.habitats.collect { |h| h.id } 
  end
end
