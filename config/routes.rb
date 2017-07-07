Rails.application.routes.draw do
  root 'welcome#index'
  get  'about'        => 'welcome#about',      :as => :about
  get  'species_cards'        => 'cards#index',        :as => :cards
  get  'lesson_plans' => 'lesson_plans#index', :as => :lesson_plans

  #  scope '(:locale)', locale: /#{I18n.available_locales.join('|')}/ do
#    resources :users
#
#    resources :places do
#      resources :habitats
#      get  'habitats/:id/langs_with_content'   => 'habitats#langs_with_content', as: :habitat_langs_with_content
#      get  'habitats/:id/draft'   => 'habitats#draft'
#
#      resources :place_permissions
#    end
#    get 'places/:id/draft'        => 'places#draft'
#
#    resources :galleries do
#      resources :gallery_photos
#    end
#
#    # The priority is based upon order of creation: first created -> highest priority.
#    # See how all your routes lay out with 'rake routes'.
#
#    # Example of regular route:
#    #   get 'products/:id' => 'catalog#view'
#    get  'login'                            => 'user_sessions#new'
#    post 'login'                            => 'user_sessions#create'
#    get  'logout'                           => 'user_sessions#destroy'
#
#    get  'migrate_user/:invitation_token'   => 'user_migrations#new', as: :migrate_user
#    post 'migrate_user/:invitation_token'   => 'user_migrations#create'
#
#    get 'tinymce_test'                      => 'tinymce_test#index'
#    get 'i18ntest'                          => 'i18n_test#index', as: :i18n_test
#    get 'foodweb_test'                      => 'foodweb_test#index', as: :foodweb_test
#
#    get  ''                                 => 'welcome#index'
#  end
#
#  post 'editor_content/create'              => 'editor_content#create'
#
#  post 'editor_content/publish_draft'       => 'editor_content#publish_draft'
#
  resources :users, :only => [:new, :create]

  get  "users/confirm/:token"         => "users#confirm", :as => :users_confirm
  get  "users/forgot_password"        => "users#forgot_password", :as => :forgot_password
  post "users/forgot_password"        => "users#mail_password_reset_token"
  get  "users/reset_password/:token"  => "users#reset_password_form", :as => :reset_password_form
  patch "users/reset_password/:token" => "users#reset_password"
  get "users/change_password"         => "users#change_password_form"
  patch "users/change_password"       => "users#change_password"
  get  "login"                        => "user_sessions#new"
  post "login"                        => "user_sessions#create"
  get  "logout"                       => "user_sessions#destroy"

  post   "card_maker_ajax/cards"                    => "card_maker_ajax#create_card"
  post   "card_maker_ajax/decks/:deck_id/cards"     => "card_maker_ajax#create_deck_card"
  put    "card_maker_ajax/cards/:card_id/save"      => "card_maker_ajax#save_card"
  get    "card_maker_ajax/cards/:card_id/svg"       => "card_maker_ajax#render_svg"
  get    "card_maker_ajax/cards/:card_id/png"       => "card_maker_ajax#render_png"
  get    "card_maker_ajax/cards/:card_id/json"      => "card_maker_ajax#card_json"
  put    "card_maker_ajax/cards/:card_id/deck_id"   => "card_maker_ajax#set_card_deck"
  delete "card_maker_ajax/cards/:card_id/deck_id"   => "card_maker_ajax#remove_card_deck"
  get    "card_maker_ajax/card_ids"                 => "card_maker_ajax#card_ids"
  get    "card_maker_ajax/card_summaries"           => "card_maker_ajax#card_summaries"
  get    "card_maker_ajax/decks/:deck_id/card_ids"  => "card_maker_ajax#deck_card_ids"
  post   "card_maker_ajax/decks"                    => "card_maker_ajax#create_deck"
  get    "card_maker_ajax/decks"                    => "card_maker_ajax#decks"
  post   "card_maker_ajax/images"                   => "card_maker_ajax#upload_image"
  get    "card_maker_ajax/templates/:template_name" => "card_maker_ajax#template"
  delete "card_maker_ajax/cards/:card_id"           => "card_maker_ajax#delete_card"
  get    "card_maker_ajax/decks/:deck_id"           => "card_maker_ajax#get_deck"
  delete "card_maker_ajax/decks/:deck_id"           => "card_maker_ajax#delete_deck"
  get    "card_maker_ajax/taxon_search/:query"      => "card_maker_ajax#taxon_search"
  get    "card_maker_ajax/taxon_details/:id"        => "card_maker_ajax#taxon_details"
  post   "card_maker_ajax/decks/:id/populateFromCollection" => "card_maker_ajax#populate_deck_from_collection"
  get    "card_maker_ajax/collectionJob/:id/status" => "card_maker_ajax#collection_job_status"

  get    "card_maker"                       => "card_maker#index", :as => :new_card

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
