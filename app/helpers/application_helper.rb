module ApplicationHelper
  def current_user_admin?
    logged_in_user && logged_in_user.admin?
  end

  def t_model_error(model, attribute, message, inter_vars={})
    t("activerecord.errors.models.#{model.to_s}.attributes.#{attribute.to_s}.#{message.to_s}", inter_vars)
  end
end
