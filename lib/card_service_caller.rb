require "httparty"

module CardServiceCaller
  SERVICE_HOST = Rails.application.config.x.card_service_host
  SERVICE_PORT = Rails.application.config.x.card_service_port
  SERVICE_URL = "http://#{SERVICE_HOST}:#{SERVICE_PORT}"

  JSON_HEADERS = { "Content-Type" => "application/json" }

  def self.create_card(json)
    HTTParty.post(
      "#{SERVICE_URL}/cards",
      :body => json,
      :headers => JSON_HEADERS
    )
  end

  def self.update_card_data(card_id, data)
    HTTParty.put(
      "#{SERVICE_URL}/cards/#{card_id}/data",
      :body => data,
      :headers => JSON_HEADERS
    )
  end

  def self.svg(card_id)
    HTTParty.get("#{SERVICE_URL}/cards/#{card_id}/svg")
  end

  def self.png(card_id)
    HTTParty.get("#{SERVICE_URL}/cards/#{card_id}/png")
  end

  def self.upload_image(data)
    HTTParty.post(
      "#{SERVICE_URL}/images",
      :body => data,
      :headers => { "Content-Type" => "application/octet-stream" }
    )
  end
end
