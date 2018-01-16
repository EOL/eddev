class AddIndicesToLicenses < ActiveRecord::Migration[4.2]
  def change
    add_index :licenses, :code, unique: true
    add_index :licenses, :name, unique: true
  end
end
