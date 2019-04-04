require 'figaro'
#
# Specifies the `environment` that Puma will run in.
rails_env = ENV.fetch("RAILS_ENV") { "development" }
environment rails_env

# Do this AFTER the above since RAILS_ENV should be a real environment variable
Figaro.application = Figaro::Application.new(environment: rails_env, path: File.expand_path('../application.yml', __FILE__))
Figaro.load

# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum; this matches the default thread size of Active Record.
#
threads_count = ENV.fetch("puma_threads_per_worker") { 5 }.to_i # Figaro only supports strings
threads threads_count, threads_count

if rails_env == "production"
  tmp_dir = "/var/www/eddev/shared/tmp"
  pidfile "#{tmp_dir}/pids/puma.pid"
  bind "unix://#{tmp_dir}/sockets/puma.sock"
else
  # Specifies the `port` that Puma will listen on to receive requests; default is 3000.
  #
  port        ENV.fetch("PORT") { 3000 }
end

# Specifies the number of `workers` to boot in clustered mode.
# Workers are forked webserver processes. If using threads and workers together
# the concurrency of the application would be max `threads` * `workers`.
# Workers do not work on JRuby or Windows (both of which do not support
# processes).
concurrency = ENV.fetch("puma_workers") { 2 }.to_i
workers concurrency

# From puma repo deployment docs:
# Don't use preload!. This dirties the master process and means it will have to shutdown all the workers and re-exec itself to get your new code. It is not compatible with phased-restart and prune_bundler as well.
#
# Use prune_bundler. This makes it so that the cluster master will detach itself from a Bundler context on start. This allows the cluster workers to load your app and start a brand new Bundler context within the worker only. This means your master remains pristine and can live on between new releases of your code.
#
# XXX: prune_bundler caused lots of warnings in the systemd logs. Not happening. Also, we're using socket activation on the server which should at least provide some semblance of graceful reload.
#prune_bundler

# If you are preloading your application and using Active Record, it's
# recommended that you close any connections to the database before workers
# are forked to prevent connection leakage.
#
before_fork do
  ActiveRecord::Base.connection_pool.disconnect! if defined?(ActiveRecord)
end

# The code in the `on_worker_boot` will be called if you are using
# clustered mode by specifying a number of `workers`. After each worker
# process is booted, this block will be run. If you are using the `preload_app!`
# option, you will want to use this block to reconnect to any threads
# or connections that may have been created at application boot, as Ruby
# cannot share connections between processes.
#
# Set up connection pool (recommended in Puma README)
on_worker_boot do
  ActiveSupport.on_load(:active_record) do
    ActiveRecord::Base.establish_connection
  end
end

# Use the `preload_app!` method when specifying a `workers` number.
# This directive tells Puma to first boot the application and load code
# before forking the application. This takes advantage of Copy On Write
# process behavior so workers use less memory. If you use this option
# you need to make sure to reconnect any threads in the `on_worker_boot`
# block.
#
preload_app!

# Allow puma to be restarted by `rails restart` command.
plugin :tmp_restart
