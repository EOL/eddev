module WelcomeHelper
  class NavCat
    attr_accessor :label
    attr_accessor :items

    def initialize(options)
      self.label = Label.new(options[:label])

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

  def nav_cats
    NAV_CATS
  end


  private
  NAV_KEY_PREFIX = "welcome.index.nav"
  NAV_CATS = [
    NavCat.new(
      :label => { 
        :text_key  => "cat_activities",
        :color => :red
      },
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
    ),
    NavCat.new(
      :label => { 
        :text_key => "cat_media",
        :color => :yellow
      },
      :items => []
    ),
    NavCat.new(
      :label => {
        :text_key => "cat_projects",
        :color => :orange
      },
      :items => []
    ),
    NavCat.new(
      :label => {
        :text_key => "cat_resources",
        :color => :green
      },
      :items => []
    )
  ]
end
