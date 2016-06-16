module EditorContentHelper
  def draft_path
    request.fullpath.sub(/(?:\/)?$/, "/draft") 
  end

  def published_path
    request.fullpath.sub(/draft(?:\/)?$/, "")
  end

  def editable_tag(tag_name, key, content_model, options = {})
    locale_state = content_model.state_for_locale(I18n.locale)

    if draft_page?
      value = locale_state.draft_content_value(key)
      required_options = { 
        "data-key-name"           => key, 
        "data-locale"             => I18n.locale, 
        "data-content-model-type" => content_model.class.name,
        "data-content-model-id"   => content_model.id,
        "data-editable"           => true,
      }
    else
      value = locale_state.content_value(key)
      required_options = {}
    end

    content_tag(tag_name, value.html_safe, options.merge(required_options))
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
