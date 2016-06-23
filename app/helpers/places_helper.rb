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

  def cur_user_is_place_editor?
    return false if !logged_in_user
    return true if logged_in_user.admin?

    !PlacePermission.where(:user => logged_in_user).limit(1).empty?
  end
end

