require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Eddev
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # Custom asset paths
    config.assets.paths << Rails.root.join('app', 'assets', 'fonts')

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    config.i18n.default_locale = :en
    config.i18n.available_locales = [:en, :es]
    config.i18n.fallbacks = [:en]

    config.secret_key_base = ENV['secret_key_base']

    config.x.app_uri_prefix = ENV['RAILS_RELATIVE_URL_ROOT'] ? ENV['RAILS_RELATIVE_URL_ROOT'] : ""
#    config.x.legacy_password_salt = Figaro.env.legacy_password_salt

    config.x.enable_ga = ENV['enable_ga'] == "true"

    # mail config
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      address:              "smtp.gmail.com",
      port:                 587,
      user_name:            ENV['email_user_name'],
      password:             ENV['email_password'],
      authentication:       "plain",
      enable_starttls_auto: true,
    }

    # enable gzip compression
    config.middleware.use Rack::Deflater

    # card service
    config.x.card_service_host = ENV['card_service_host']
    config.x.card_service_port = ENV['card_service_port']
    config.x.card_service_key  = ENV['card_service_key']
    config.x.card_service_use_https =
      ENV['card_service_use_https'] == "true" ?
      true :
      false
  end
end
