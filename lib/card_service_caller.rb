require "httparty"

class CardServiceCaller
  SERVICE_HOST = Rails.application.config.x.card_service_host
  SERVICE_PORT = Rails.application.config.x.card_service_port
  SERVICE_URL = "http://#{SERVICE_HOST}:#{SERVICE_PORT}"

  def self.create_card(json)
    HTTParty.post("#{SERVICE_URL}/cards", json)
  end
end
