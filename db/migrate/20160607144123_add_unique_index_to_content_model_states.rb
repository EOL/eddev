class AddUniqueIndexToContentModelStates < ActiveRecord::Migration
  def change
    add_index :content_model_states, [:content_model_id, :content_model_type, :locale], 
      :unique => true, :name => "unique_index_content_model_and_locale"
  end
end
