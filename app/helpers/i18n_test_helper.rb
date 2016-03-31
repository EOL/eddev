module I18nTestHelper
  def lang_select_options
    I18n.available_locales.map do |locale|
      [t("language", locale: locale), i18n_test_path(locale: locale)]
    end
  end

  def lang_select_selected
    i18n_test_path(locale: I18n.locale)
  end
end
