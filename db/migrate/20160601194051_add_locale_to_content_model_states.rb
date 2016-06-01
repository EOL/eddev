class AddLocaleToContentModelStates < ActiveRecord::Migration
  def change
    add_column :content_model_states, :locale, :string, limit: 5
  end
end
