JsRoutes.setup do |config|
  config.include = [/(^asset$|^image$|^card_maker$|^podcasts$)/]
  config.url_links = true
end
