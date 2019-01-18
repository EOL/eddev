class PodcastPresenter < BasePresenter
  attr_accessor :image

  def initialize(podcast, view)
    super
    @image = PodcastImagePresenter.new(podcast.image, view)
  end

  def audio_path
    "podcasts/audio/#{audio_file_name}"
  end

  def audio_size
    File.open(Rails.root.join("public", audio_path), "r") do |f|
      f.size
    end
  end

  def audio_url
    view.root_url + audio_path
  end

  def transcript_path
    transcript_file_name ? 
      "podcasts/transcripts/#{transcript_file_name}" : 
      nil
  end

  def category_ids
    categories.map { |c| c.id }
  end

  def to_obj
    {
      title: title,
      description: description,
      audioPath: audio_path,
      transcriptPath: transcript_path,
      eolUrl: eol_url,
      lessonPlanUrl: lesson_plan_url,
      permId: perm_id,
      sciName: sci_name,
      audioSlideshowUrl: audio_slideshow_url,
      categoryIds: category_ids,
      image: image.to_obj
    }
  end

  def duration_string
    mins = length_seconds / 60
    secs = length_seconds % 60
    sprintf "%d:%02d", mins, secs
  end

  def url
    view.podcast_url(slug: perm_id)
  end

  def clean_description
    @clean_description ||= view.strip_tags(description)
  end

  def description_has_html?
    clean_description != description
  end
end
