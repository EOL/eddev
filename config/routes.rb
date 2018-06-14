Rails.application.routes.draw do
  root 'welcome#index'

  scope '(:locale)', locale: /#{I18n.available_locales.reject { |l| l == I18n.default_locale}.join('|')}/ do
    get  ''            => 'welcome#index'
    get  'about'        => 'welcome#about',      :as => :about
    get  'species_cards'        => 'cards#index',        :as => :cards
    get  'lesson_plans' => 'lesson_plans#index', :as => :lesson_plans

    resources :users, :only => [:new, :create]

    get  "users/confirm/:token"         => "users#confirm", :as => :users_confirm
    get  "users/forgot_password"        => "users#forgot_password", :as => :forgot_password
    post "users/forgot_password"        => "users#mail_password_reset_token"
    get  "users/reset_password/:token"  => "users#reset_password_form", :as => :reset_password_form
    patch "users/reset_password/:token" => "users#reset_password"
    get "users/change_password"         => "users#change_password_form", :as => :change_password_form
    patch "users/change_password"       => "users#change_password"
    get "users/list"                    => "users#list"
    get "users/account"                 => "users#account", :as => :account
    get "users/typeahead/:q"            => "users#typeahead"
    get  "login"                        => "user_sessions#new"
    post "login"                        => "user_sessions#create"
    get  "logout"                       => "user_sessions#destroy"
    get  "user_sessions/user_info"      => "user_sessions#user_info"

    # Card maker
    post   "card_maker_ajax/cards"                    => "card_maker_ajax#create_card"
    post   "card_maker_ajax/decks/:deck_id/cards"     => "card_maker_ajax#create_deck_card"
    put    "card_maker_ajax/cards/:card_id/save"      => "card_maker_ajax#save_card"
    get    "card_maker_ajax/cards/:card_id(.:format)" => "card_maker_ajax#get_card"
    put    "card_maker_ajax/cards/:card_id/deck_id"   => "card_maker_ajax#set_card_deck"
    delete "card_maker_ajax/cards/:card_id/deck_id"   => "card_maker_ajax#remove_card_deck"
#    get    "card_maker_ajax/card_ids"                 => "card_maker_ajax#card_ids"
    get    "card_maker_ajax/card_summaries"           => "card_maker_ajax#card_summaries"
    get    "card_maker_ajax/decks/:deck_id/card_ids"  => "card_maker_ajax#deck_card_ids"
    post   "card_maker_ajax/decks"                    => "card_maker_ajax#create_deck"
    get    "card_maker_ajax/decks"                    => "card_maker_ajax#decks"
    post   "card_maker_ajax/images"                   => "card_maker_ajax#upload_image"
    get    "card_maker_ajax/templates/:template_name/:template_version" => "card_maker_ajax#template",
      :constraints => { :template_version => /\d\.\d/ }
    delete "card_maker_ajax/cards/:card_id"           => "card_maker_ajax#delete_card"
    get    "card_maker_ajax/decks/:deck_id"           => "card_maker_ajax#get_deck"
    delete "card_maker_ajax/decks/:deck_id"           => "card_maker_ajax#delete_deck"
    get    "card_maker_ajax/taxon_search/:query"      => "card_maker_ajax#taxon_search"
    post   "card_maker_ajax/decks/:id/populateFromCollection" => "card_maker_ajax#populate_deck_from_collection"
    get    "card_maker_ajax/collectionJob/:id/status" => "card_maker_ajax#collection_job_status"
    post   "card_maker_ajax/deck_pdfs"                => "card_maker_ajax#create_deck_pdf"
    get    "card_maker_ajax/deck_pdfs/:id/status"     => "card_maker_ajax#deck_pdf_status"
    get    "card_maker_ajax/deck_pdfs/:id/result.pdf" => "card_maker_ajax#deck_pdf_result"
    post   "card_maker_ajax/decks/:deck_id/desc"      => "card_maker_ajax#set_deck_desc"
    post   "card_maker_ajax/decks/:deck_id/make_public" => "card_maker_ajax#make_deck_public"
    post   "card_maker_ajax/decks/:deck_id/make_private" => "card_maker_ajax#make_deck_private"
    post   "card_maker_ajax/decks/:deck_id/users"     => "card_maker_ajax#add_deck_user"
    delete "card_maker_ajax/decks/:deck_id/users/:user_id" => "card_maker_ajax#remove_deck_user"
    get    "card_maker_ajax/decks/:deck_id/users"     => "card_maker_ajax#deck_users"
    get    "card_maker_ajax/public/cards"             => "card_maker_ajax#get_public_cards"
    get    "card_maker_ajax/public/decks"             => "card_maker_ajax#get_public_decks"
    post   "card_maker_ajax/decks/:deck_id/name/"     => "card_maker_ajax#rename_deck"
    get    "card_maker"                               => "card_maker#index", :as => :card_maker
  end

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
