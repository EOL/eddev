json.array!(@users) do |user|
  json.extract! user, :id, :email, :user_name, :full_name, :api_key, :password_digest, :api_key, :active
  json.url user_url(user, format: :json)
end
