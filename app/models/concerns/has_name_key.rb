module HasNameKey
  extend ActiveSupport::Concern

  def localized_name
    I18n.translate("models.#{model_name.param_key}.names.#{name_key}")
  end
end
