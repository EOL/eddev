class Habitat < ApplicationRecord
  include ContentModel

  belongs_to :place

  validates :name, presence: true, uniqueness: true
  validates_presence_of :place_id

  supplies_edit_permissions_with :has_place_permission?

  def self.all_ordered_alpha_with_place
    includes(:place).order('places.name').order(:name)
  end

  private
    def has_place_permission?(user)
      place.can_be_edited_by?(user)
    end
end
