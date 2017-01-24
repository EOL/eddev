module HasNameKey
  extend ActiveSupport::Concern

  def localized_name
    I18n.translate("models.#{model_name.param_key}.name_keys.#{name_key}")
  end
end
