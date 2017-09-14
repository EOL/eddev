module Helpers
  def get_with_locale(action, args = {})
    process_with_locale(action, 'GET', args)
  end

  def post_with_locale(action, args = {})
    process_with_locale(action, 'POST', args)
  end

  def process_with_locale(action, http_method = 'GET', args = {})
    process(action, :method => http_method, :params => default_locale_for_args(args))
  end

  private
    # This merge direction allows parameters[:locale] to override the default
    def default_locale_for_args(args)
      { locale: I18n.default_locale }.merge(args)
    end
end
