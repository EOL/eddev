module ContentModelHelper
  def published_locales(model)
    published_locales = model.published_locales

    published_locales.empty? ? "None" : published_locales.join(", ")
  end

  def cur_user_can_edit?(model)
    model.can_be_edited_by?(logged_in_user)
  end
end
