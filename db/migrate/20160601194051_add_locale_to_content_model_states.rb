class AddLocaleToContentModelStates < ActiveRecord::Migration[4.2]
  def change
    add_column :content_model_states, :locale, :string, limit: 5
  end
end
