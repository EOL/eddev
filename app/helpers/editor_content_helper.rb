module EditorContentHelper
  # These url helper methods assume routes of the form 
  # .../content_model/:id for the published view and
  # .../content_model/:id/draft for the draft view.
  def draft_path
    request.fullpath.sub(/(?:\/)?$/, "/draft") 
  end

  def published_path
    request.fullpath.sub(/draft(?:\/)?$/, "")
  end

  def editable_tag(tag_name, key, content_model, options = {})
    required_options = {}
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
    end

    editor_content_class = "editor-content" 
    if options[:class]
      options[:class] += " #{editor_content_class}"
    else
      options[:class] = editor_content_class 
    end

    content_tag(tag_name, value.html_safe, options.merge(required_options))
  end 
end
