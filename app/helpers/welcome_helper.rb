module WelcomeHelper
  def login_btn_toggle_txt_key
    if logged_in_user
      ".sign_in"
    else
      ".sign_out"
    end
  end

  def login_btn_state
    if logged_in_user
      :signed_in
    else
      :signed_out
    end 
  end

  def login_btn_txt_key
    if logged_in_user
      ".sign_out"
    else
      ".sign_in"
    end
  end

  def nav_cats
    NAV_CATS
  end

  def sign_in_btn_txt
  end

  def nav_t(key)
    raw I18n.translate("#{NAV_KEY_PREFIX}.#{key}")
  end

  private
  NAV_KEY_PREFIX = "welcome.index.nav"
  NAV_CATS = [
    {
      :label => { 
        :text_key  => "cat_activities",
        :color => :red
      },
      :dropdown_partial => :nav_links,
      :items => [
        {
          :text_key => "memory_game",
          :target_url => "/memory"     
        },
        {
          :text_key => "coloring_pages",
          :target_url => "https://drive.google.com/file/d/0B00hDkSQMhfDMXdIVng0NGd0WlU/view"
        },
        {
          :text_key => "species_cards",
          :target_url => "http://eol.org/info/eol.org/info/species_cards"
        },
        {
          :text_key => "inaturalist",
          :target_url => "http://www.inaturalist.org/"
        }
      ] 
    },
    {
      :label => { 
        :text_key => "cat_media",
        :color => :yellow
      },
      :dropdown_partial => :nav_links,
      :items => [
        {
          :text_key => "podcasts", 
          :target_url => "http://eol.org/info/podcasts"
        },
        {
          :text_key => "google_earth_tours", 
          :target_url => "http://eol.org/info/disc_google_earth"
        },
        {
          :text_key => "hi_res_photos",
          :target_url => "http://eol.org/collections/21048"
        },
      ]
    },
    {
      :label => {
        :text_key => "cat_resources",
        :color => :orange
      },
      :dropdown_partial => :nav_links,
      :items => [
        {
          :text_key => "biodiv_articles",
          :target_url => "http://eol.org/info/discover_articles"
        },
        {
          :text_key => "learning_resources",
          :target_url => "http://eol.org/info/ed_resources"
        },
        {
          :text_key => "featured_collections",
          :target_url => "http://eol.org/info/featured_collections"
        },
        {
          :text_key => "eol_places",
          :target_url => "http://education.eol.org/ecosystems/"
        },
      ]
    },
    {
      :label => {
        :text_key => "cat_about",
        :color => :green,
      },
      :dropdown_partial => :about_dropdown,
      :items => [
        "about.eol_is_an_open_science_html",
        "about.thats_where_l_and_e_comes_in_html",
        "about.if_you_are_interested_in_collaborating_html",
      ]
    }
  ]
end
