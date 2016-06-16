Rails.application.routes.draw do
  # You can have the root of your site routed with 'root'
  root 'welcome#index'


  scope '(:locale)', locale: /#{I18n.available_locales.join('|')}/ do
    resources :users
  
    resources :places do

      resources :habitats do
        post 'copy'               => 'habitats#copy', as: :habitats_copy
      end

      get  'habitats/:id/langs_with_content'   => 'habitats#langs_with_content', as: :habitat_langs_with_content
      get  'habitats/:id/draft'   => 'habitats#draft'
    end
    get 'places/:id/draft'        => 'places#draft'

    resources :galleries do
      resources :gallery_photos
    end

    # The priority is based upon order of creation: first created -> highest priority.
    # See how all your routes lay out with 'rake routes'.

    # Example of regular route:
    #   get 'products/:id' => 'catalog#view'
    get  'login'                            => 'user_sessions#new'
    post 'login'                            => 'user_sessions#create'
    get  'logout'                           => 'user_sessions#destroy'

    get  'migrate_user/:invitation_token'   => 'user_migrations#new', as: :migrate_user
    post 'migrate_user/:invitation_token'   => 'user_migrations#create'

    get 'tinymce_test'                      => 'tinymce_test#index'
    get 'i18ntest'                          => 'i18n_test#index', as: :i18n_test
    get 'foodweb_test'                      => 'foodweb_test#index', as: :foodweb_test

    get  ''                                 => 'welcome#index'
  end

  post 'editor_content/create'              => 'editor_content#create'

  post 'editor_content/publish_draft'       => 'editor_content#publish_draft'


  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
