module ApplicationHelper
  def logged_in_user
    nil

    if session[:user_id]
      @logged_in_user ||= User.find(session[:user_id])
    end
  end

  def ensure_admin
    if !logged_in_user || !logged_in_user.admin?
      raise ApplicationController::ForbiddenError
    end
  end

  # EditorContent helper
  def editable_tag(name, key, options = {})
    required_options = { "data-content-key": key, "data-locale": I18n.locale, "data-editable": true }
    stored_content = EditorContent.order(id: :desc).find_by(key: key, locale: I18n.locale)
    content = key

    if stored_content
      content = stored_content.value
    end

    content_tag(name, content.html_safe, options.merge(required_options))
  end
end
