namespace :eoltest do
  require "rspec/core/rake_task"
  RSpec::Core::RakeTask.new(:spec)

  task :db_consistency do
    sh "bundle exec consistency_fail"
  end
end

task :eoltest => ["eoltest:db_consistency", "eoltest:spec"] {}
