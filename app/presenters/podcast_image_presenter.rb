class PodcastImagePresenter < BasePresenter
  def path
    podcast.image.file_name ? 
      view.image_path("podcasts/thumbnails/#{podcast.image.file_name}") : 
      nil
  end

  def to_obj
    {
      path: path,
      author: podcast.image.author,
      license: podcast.image.license,
      title: podcast.image.title
    }
  end
end
