module ApplicationHelper
  def current_user_admin?
    logged_in_user && logged_in_user.admin?
  end

  def t_model_error(model, attribute, message, inter_vars={})
    t("activerecord.errors.models.#{model.to_s}.attributes.#{attribute.to_s}.#{message.to_s}", inter_vars)
  end

  def about_page?
    current_page? :controller => "welcome", :action => "about"
  end

  # Abstract away different checks for dev and prod
  def asset_exists?(path)
    if Rails.configuration.assets.compile
      Rails.application.precompiled_assets.include? path
    else
      Rails.application.assets_manifest.assets[path].present?
    end
  end

  def contact_url
    "http://eol.org/contact_us?subject=learning"
  end

  def deck_pdf_path(deck_name)
    "/species_cards/#{deck_name}.pdf"
  end
end
