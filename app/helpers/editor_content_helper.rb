module EditorContentHelper
  def can_edit(key)
    logged_in_user && logged_in_user.admin?
  end 

  def editable_tag(name, key, options = {})
    editable_tag_helper(name, key, nil, options)
  end

  def model_editable_tag(name, key, content_owner, options = {})
    editable_tag_helper(name, key, content_owner, options)
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

    required_options = {}
    if can_edit(key)
      required_options = { 
        "data-content-key": key, 
        "data-locale": I18n.locale, 
        "data-editable": true,
      }

      if content_owner
        required_options.merge!({
          "data-owner-type": owner_type,
          "data-owner-id": owner_id,
        })
      end
    end

    stored_content = content_owner ? content_for_key_model(key, owner_type, owner_id) : content_for_key(key)
    content = stored_content ? stored_content.value : key.to_s # key.to_s for symbol or string argument

    content_tag(name, content.html_safe, options.merge(required_options))
  end
end
