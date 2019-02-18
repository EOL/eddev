source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '5.1.4'
# Use mysql for database
gem 'mysql2', '~> 0.4.0'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

# jquery UI
gem 'jquery-ui-rails'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.7'

# Figaro for ENV-based config
gem "figaro"

gem "tinymce-rails"

# s3 integration
gem "aws-sdk", "< 2.0"

# Platform-independent crypt (for authenticating against legacy passwords)
gem "unix-crypt"

gem "haml"

gem "sass_paths"

gem "httparty"

# Use Unicorn as the app server
# gem 'unicorn'

gem "react-rails"

gem "webpacker"

gem "i18n-js"

# Error reporting
gem "bugsnag"

gem "js-routes"

# app server
gem "puma"

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Use rspec for testing
  gem 'rspec-rails', '~> 3.0'
  gem 'rspec-collection_matchers'

  # Matchers for concise common rspec tests
  gem 'shoulda-matchers', git: 'https://github.com/thoughtbot/shoulda-matchers.git', branch: 'rails-5'

  # Model factory for testing
  gem 'factory_girl_rails', '~> 4.0'

  # Find uniqueness validations that don't have a corresponding DB constraint
  gem 'consistency_fail'
end

group :development do
  gem 'listen'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'

  # Capistrano for deployment
  gem 'capistrano', '~> 3.1'
  gem 'capistrano-rails', '~> 1.1'
  gem 'capistrano-rails-collection'
  gem 'capistrano-passenger', '~> 0.2.0'
  gem 'capistrano-git-with-submodules', '~> 2.0'

  gem 'better_errors'
  gem 'i18n_yaml_sorter'
end
