JsRoutes.setup do |config|
  config.include = [/(^asset$|^image$|^card_maker$|^podcasts$|^podcast_category_groups$)/]
  config.url_links = true
end
