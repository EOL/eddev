module PlacesHelper
  def habitats_for_select
    Habitat.all.collect { |h| [h.name, h.id] }
  end

  def habitat_ids(place)
    place.habitats.collect { |h| h.id } 
  end

  def cur_user_owns?(place)
    place.is_owned_by?(logged_in_user)
  end
end
