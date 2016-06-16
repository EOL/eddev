class Place < ActiveRecord::Base
  include ContentModel

  supplies_edit_permissions_with :can_user_edit_content?

  has_many :habitats, :dependent => :destroy
  has_many :place_permissions, :dependent => :destroy

  private
    def can_user_edit_content?(user)
      !place_permissions.where(:user => user).limit(1).empty?
    end
end
