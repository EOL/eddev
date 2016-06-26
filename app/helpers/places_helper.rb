module PlacesHelper
  def habitats_for_select
    Habitat.all.collect { |h| [h.name, h.id] }
  end

  def habitat_ids(place)
    place.habitats.collect { |h| h.id } 
  end
end

