class AddAudioSlideshowUrlToPodcasts < ActiveRecord::Migration[5.1]
  def change
    add_column :podcasts, :audio_slideshow_url, :string
  end
end
