class AddTranscriptFileNameToPodcasts < ActiveRecord::Migration[5.1]
  def change
    add_column :podcasts, :transcript_file_name, :string
  end
end
