module Helpers
  def get_with_locale(action, parameters)
    get action, default_locale_for_parameters(parameters)
  end

  def post_with_locale(action, parameters)
    post action, default_locale_for_parameters(parameters)
  end

  private
    # This merge direction allows parameters[:locale] to override the default
    def default_locale_for_parameters(parameters)
      { locale: I18n.default_locale }.merge(parameters)
    end
end

