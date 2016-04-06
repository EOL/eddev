class AddIndicesToLicenses < ActiveRecord::Migration
  def change
    add_index :licenses, :code, unique: true
    add_index :licenses, :name, unique: true
  end
end
