module I18nTestHelper
  def url_lang_select_options
    I18n.available_locales.map do |locale|
      [t("language", locale: locale), i18n_test_path(locale: locale)]
    end
  end

  def url_lang_selected
    i18n_test_path(locale: I18n.locale)
  end

  def user_lang_select_options
    I18n.available_locales.map do |locale|
      [t("language", locale: locale), locale]
    end
  end
end
