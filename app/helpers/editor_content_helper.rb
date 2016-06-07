module EditorContentHelper
  def can_edit(key)
    logged_in_user && logged_in_user.admin?
  end 

  def editable_tag(tag_name, key_name, content_model, options = {})
    key = EditorContentKey.find_or_create(
      name: key_name, 
      content_model_id: content_model.id, 
      content_model_type: content_model.class.name,
      locale: I18n.locale
    )

    required_options = {}

    if can_edit(key)
      required_options = { 
        "data-key-name" => key.name, 
        "data-locale" => key.locale, 
        "data-content-model-type" => key.content_model_type,
        "data-content-model-id" => key.content_model_id,
        "data-editable" => true,
      }
    end

    content_tag(tag_name, key.latest_value.html_safe, options.merge(required_options))
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

  def content_for_key_model(key, model_type, model_id)
    return EditorContent.order(id: :desc).find_by(key: key, locale: I18n.locale, editor_content_owner_type: model_type, editor_content_owner_id: model_id)
  end

  def editable_tag_helper(name, key, content_owner, options = {})
    if content_owner
      owner_type = content_owner.class.name
      owner_id = content_owner.id
    end
  end
end
