class PodcastPresenter < BasePresenter
  attr_accessor :image

  def initialize(podcast, view)
    super
    @image = PodcastImagePresenter.new(podcast.image, view)
  end

  def audio_path
    "podcasts/audio/#{audio_file_name}"
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
end
