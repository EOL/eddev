class RecaptchaVerifier
  API_URL = 'https://www.google.com/recaptcha/api/siteverify'
  API_KEY = Rails.application.config.x.recaptcha_secret_key

  def initialize(token)
    @token = token
  end

  def success?
    @success ||= verify
  end

  private
  def verify
    response = HTTParty.post(
      API_URL,
      body: {
        secret: API_KEY,
        response: @token
      }
    )

    if response.code >= 400
      Rails.application.logger.error('error response from recaptcha API', response)
      return false
    end

    response.parsed_response["success"]
  end
end

