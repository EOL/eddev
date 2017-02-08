Rails.application.routes.draw do
  root 'welcome#index'
  get  'about'        => 'welcome#about',      :as => :about
  get  'species_cards'        => 'cards#index',        :as => :cards
  get  'lesson_plans' => 'lesson_plans#index', :as => :lesson_plans

  if Rails.env.development?
    get  'species_cards/new'         => 'cards#new',          :as => :new_card
  end
end
