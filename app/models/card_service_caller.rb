# Card service API interface

require "httparty"
require "uri"

module CardServiceCaller
  SERVICE_HOST = Rails.application.config.x.card_service_host
  SERVICE_PORT = Rails.application.config.x.card_service_port
  SERVICE_KEY  = Rails.application.config.x.card_service_key
  USE_HTTPS    = Rails.application.config.x.card_service_use_https
  PROTOCOL     = USE_HTTPS ? "https" : "http"
  SERVICE_URL = "#{PROTOCOL}://#{SERVICE_HOST}:#{SERVICE_PORT}"

  JSON_HEADERS = { "Content-Type" => "application/json" }
  TEXT_PLAIN_HEADERS = { "Content-Type" => "text/plain" }

  def self.create_card(user_id, json)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/cards",
      :body => json,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.create_card_in_deck(user_id, deck_id, json)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/cards",
      :body => json,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.create_deck(user_id, json)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/decks",
      :body => json,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.get_decks(user_id)
    HTTParty.get(
      "#{self.user_prefix(user_id)}/decks",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.save_card(user_id, card_id, data)
    HTTParty.put(
      "#{self.user_prefix(user_id)}/cards/#{card_id}/save",
      :body => data,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.svg_lo_res(card_id)
    HTTParty.get(
      "#{SERVICE_URL}/cards/#{card_id}/svg/lo",
      :headers => self.add_api_headers({})
    )
  end

  def self.svg_hi_res(card_id) 
    HTTParty.get(
      "#{SERVICE_URL}/cards/#{card_id}/svg/hi",
      :headers => self.add_api_headers({})
    )
  end

  def self.png(card_id)
    HTTParty.get(
      "#{SERVICE_URL}/cards/#{card_id}/png",
      :headers => self.add_api_headers({})
    )
  end

  def self.json(user_id, card_id)
    HTTParty.get(
      "#{self.user_prefix(user_id)}/cards/#{card_id}/json",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.delete_card(user_id, card_id)
    HTTParty.delete(
      "#{self.user_prefix(user_id)}/cards/#{card_id}",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.delete_deck(user_id, deck_id)
    HTTParty.delete(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.get_deck(user_id, deck_id)
    HTTParty.get(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.upload_image(user_id, data)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/images",
      :body => data,
      :headers => self.add_api_headers({
        "Content-Type" => "application/octet-stream"
      }) # Let the service determine the file type
    )
  end

  def self.get_template(name, version)
    HTTParty.get(
      "#{SERVICE_URL}/templates/#{name}/#{version}",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.card_ids(user_id)
    HTTParty.get(
      "#{self.user_prefix(user_id)}/cardIds",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.card_summaries(user_id)
    HTTParty.get(
      "#{self.user_prefix(user_id)}/cardSummaries",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.card_ids_for_deck(user_id, deck_id)
    HTTParty.get(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/cardIds",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.set_card_deck(user_id, card_id, deck_id)
    HTTParty.put(
      self.card_deck_path(user_id, card_id),
      :body => deck_id,
      :headers => self.add_api_headers(TEXT_PLAIN_HEADERS)
    )
  end

  def self.remove_card_deck(user_id, card_id)
    HTTParty.delete(
      self.card_deck_path(user_id, card_id),
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.taxon_search(query)
    HTTParty.get(
      "#{SERVICE_URL}/taxonSearch/#{CGI::escape(query)}",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.populate_deck_from_collection(user_id, deck_id, post_body)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/populateFromCollection",
      :body => post_body,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.collection_job_status(job_id)
    HTTParty.get(
      "#{SERVICE_URL}/collectionJob/#{job_id}/status",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.create_deck_pdf(post_body)
    HTTParty.post(
      "#{SERVICE_URL}/deckPdfs",
      :body => post_body,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.create_deck_pngs(post_body)
    HTTParty.post(
      "#{SERVICE_URL}/deckPngs",
      :body => post_body,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.deck_png_status(job_id)
    HTTParty.get(
      "#{SERVICE_URL}/deckPngs/#{job_id}/status",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.deck_png_result(file_name)
    HTTParty.get(
      "#{SERVICE_URL}/deckPngs/downloads/#{URI.encode(file_name)}",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.deck_pdf_status(job_id)
    HTTParty.get(
      "#{SERVICE_URL}/deckPdfs/#{job_id}/status",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.deck_pdf_result(file_name)
    HTTParty.get(
      "#{SERVICE_URL}/deckPdfs/downloads/#{URI.encode(file_name)}",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.set_deck_desc(user_id, deck_id, desc)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/desc",
      :body => desc,
      :headers => self.add_api_headers(TEXT_PLAIN_HEADERS)
    )
  end

  def self.make_deck_public(user_id, deck_id)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/makePublic",
      :body => nil,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.make_deck_private(user_id, deck_id)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/makePrivate",
      :body => nil,
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.get_public_decks()
    HTTParty.get(
      "#{SERVICE_URL}/public/decks",
      :headers => self.add_api_headers(JSON_HEADERS) 
    )
  end

  def self.get_public_cards()
    HTTParty.get(
      "#{SERVICE_URL}/public/cards",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.add_deck_user(user_id, deck_id, add_user_id)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/users",
      :body => add_user_id,
      :headers => self.add_api_headers(TEXT_PLAIN_HEADERS)
    )
  end

  def self.remove_deck_user(user_id, deck_id, remove_user_id)
    HTTParty.delete(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/users/#{remove_user_id}",
      :headers => self.add_api_headers(JSON_HEADERS)
    ) 
  end

  def self.deck_users(user_id, deck_id)
    HTTParty.get(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/users",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.rename_deck(user_id, deck_id, name) 
    HTTParty.post(
      "#{self.user_prefix(user_id)}/decks/#{deck_id}/name",
      :body => name,
      :headers => self.add_api_headers(TEXT_PLAIN_HEADERS)
    )
  end

  def self.card_backs
    HTTParty.get(
      "#{SERVICE_URL}/cardBacks",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.cached_image(img_url)
    HTTParty.get(
      "#{SERVICE_URL}/cachedImages/#{img_url}",
      :headers => self.add_api_headers({})
    )
  end

  def self.public_cards_for_taxon(taxon_id)
    HTTParty.get(
      "#{SERVICE_URL}/taxa/#{taxon_id}/cards/public",
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  def self.refresh_card_images(user_id, card_id)
    HTTParty.post(
      "#{self.user_prefix(user_id)}/cards/#{card_id}/refreshImages",
      :body => {},
      :headers => self.add_api_headers(JSON_HEADERS)
    )
  end

  private
    def self.user_prefix(user_id)
      "#{SERVICE_URL}/users/#{user_id}"
    end

    def self.card_deck_path(user_id, card_id)
      "#{self.user_prefix(user_id)}/cards/#{card_id}/deckId"
    end

    def self.add_api_headers(headers)
      { 
        :'x-api-key' => SERVICE_KEY, 
        :'x-locale' => I18n.locale.to_s,
        :'x-Request-ID' => RequestId.get
      }.merge(headers)
    end

    def self.build_service_url(use_https, host, port)
      prefix = use_https ? "https://" : "http://"
      "#{prefix}#{host}:#{port}"
    end
end
