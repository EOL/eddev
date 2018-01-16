class RemoveNameAndDescriptionFromLicenses < ActiveRecord::Migration[4.2]
  def up
    remove_column :licenses, :name
    remove_column :licenses, :description
  end

  def down
    add_column :licenses, :name, :string
    add_column :licenses, :description, :string
  end
end
