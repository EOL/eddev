module PlacesHelper
  def habitats_for_select
    Habitat.all.collect { |h| [h.name, h.id] }
  end
end

