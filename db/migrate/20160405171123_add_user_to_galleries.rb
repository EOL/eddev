class AddUserToGalleries < ActiveRecord::Migration[4.2]
  def change
    add_reference :galleries, :user, index: true, foreign_key: true
  end
end
