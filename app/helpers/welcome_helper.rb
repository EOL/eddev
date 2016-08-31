module WelcomeHelper
  class NavCat
    attr_accessor :label
    attr_accessor :items
    attr_accessor :dropdown_partial

    def initialize(options)
      self.label = Label.new(options[:label])
      self.dropdown_partial = options[:dropdown_partial]

      self.items = []
      options[:items].each do |item|
        self.items << Item.new(item)
      end
    end


    class Label
      attr_accessor :text_key
      attr_accessor :color

      def initialize(options)
        self.text_key = options[:text_key]
        self.color    = options[:color]
      end

      def text
        I18n.translate "#{NAV_KEY_PREFIX}.#{text_key}"
      end
    end

    class Item
      attr_accessor :text_key
      attr_accessor :img_url
      attr_accessor :target_url
      
      def initialize(options)
        self.text_key   = options[:text_key]
        #self.img_url    = options[:img_url]
        self.img_url = "https://placekitten.com/165/165"
        self.target_url = options[:target_url]
      end

      def text
        I18n.translate "#{NAV_KEY_PREFIX}.#{text_key}"
      end
    end
  end

  def login_btn_txt_key
    if logged_in_user
      ".sign_out"
    else
      ".sign_in"
    end
  end

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

  def nav_cats
    NAV_CATS
  end

  def sign_in_btn_txt
  end

  def nav_t(key)
    I18n.translate("#{NAV_KEY_PREFIX}.#{key}")
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
          :target_url => "http://fieldguides.eol.org/memory/"     
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
        "About eol blah blah blah blah"
      ]
    }
  ]
end
