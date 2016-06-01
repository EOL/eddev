class CreateContentModelStates < ActiveRecord::Migration
  def change
    create_table :content_model_states do |t|
      t.references :content_model, polymorphic: true, index: { name: "index_content_model" }
      t.integer :editor_content_version
      t.boolean :published

      t.timestamps null: false
    end
  end
end
