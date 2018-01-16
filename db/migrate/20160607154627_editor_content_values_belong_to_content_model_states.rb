class EditorContentValuesBelongToContentModelStates < ActiveRecord::Migration[4.2]
  def change
    change_table :editor_content_values do |t|
      t.remove_references :editor_content_key, :foreign_key => true
      t.references :content_model_state, :index => true, :foreign_key => true
    end
  end
end
