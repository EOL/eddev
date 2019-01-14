class PodcastsController < ApplicationController
  before_action :disable_main_col
  before_action :main_nopad_bot
  before_action :nohero
  before_action :set_podcasts, only: :index

  def index
    respond_to do |format|
      format.html { index_html }
      format.rss { index_rss }
    end
  end

  private
    def index_html
      @podcasts_json = @podcasts.map do |podcast|
        podcast.to_obj
      end

      @categories_by_id = PodcastCategory.all.map do |c|
        [c.id, { name: c.name, desc: c.desc, groupId: c.group.id }]
      end.to_h

      @category_groups = PodcastCategoryGroup.all.map do |g|
        {
          name: g.name,
          categoryIds: g.categories.map { |c| c.id },
          id: g.id,
          iconPath: view_context.image_path("podcasts/icons/#{g.icon_file_name}")
        }
      end
    end

    def index_rss
      render layout: false
    end

    def set_podcasts
      @podcasts = Podcast.all.includes([:categories, :image]).map do |podcast|
        PodcastPresenter.new(podcast, view_context)
      end
    end
end

