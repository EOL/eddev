# README

1. Install ruby (I recommend rbenv - this project contains a .ruby_version file)
2. Install mysql ( `$ brew install mysql`, then configure )
3. `$ gem install bundler`
4. `$ bundle install`
5. Create config/application.yml (see config/application_sample.yml)
6. `$ rake db:setup`
7. `$ git submodule init && git submodule update`
8. Install and configure your system to use the node version in .nvmrc. If you have nvm, you can just do `nvm use`
8. Install yarn (`$ brew install yarn`)
9. Yarn install: `$ yarn install`

10. install and run the [card-svc](https://github.com/mvitale/cardgen-proto)
