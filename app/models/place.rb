class Place < ApplicationRecord
  include ContentModel

  supplies_edit_permissions_with :can_user_edit_content?

  has_many :habitats, :dependent => :destroy
  has_many :place_permissions, :dependent => :destroy

  def is_owned_by?(user)
    if !user
      return false
    end

    if user.admin?
      return true
    end

    !place_permissions
      .where(:user => user, :role => PlacePermission.roles[:owner])
      .limit(1)
      .empty?
  end

  private
    def can_user_edit_content?(user)
      !place_permissions.where(:user => user).limit(1).empty?
    end
end
