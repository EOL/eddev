require "httparty"

# This may be useful at some point, so I haven't deleted it.
module EolApiCaller
  API_URL = "http://www.eol.org/api"
  JSON_EXT = "1.0.json"

#  def self.search(query)
#    HTTParty.get(
#      self.api_url("search"), {
#        :query => {
#          :q => query,
#          :page => 1,
#          :exact => false
#        }
#      }
#    )
#  end

  private
    def self.api_url(api_name)
      return "#{API_URL}/#{api_name}/#{JSON_EXT}"
    end
end
