module EditorContentHelper
  def can_edit(key)
    logged_in_user && logged_in_user.admin?
  end 

  def editable_tag(name, key, options = {})
    required_options = 
      can_edit(key) ? { "data-content-key": key, "data-locale": I18n.locale, "data-editable": true } : {}

    stored_content = content_for_key(key)
    content = key

    if stored_content
      content = stored_content.value
    end

    content_tag(name, content.html_safe, options.merge(required_options))
  end

  def copy_value_if_exists!(key_from, key_to, locale = I18n.locale)
    stored_content = content_for_key(key_from)

    if stored_content
      EditorContent.create!(key: key_to, value: stored_content.value, locale: locale)
    end
  end

  private
  def content_for_key(key)
    return EditorContent.order(id: :desc).find_by(key: key, locale: I18n.locale)
  end
end
