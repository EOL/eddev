require "csv"
require "optparse"

reject_file = open(ARGV[0], "w")

User.transaction do
  $stdin.each do |line|
    CSV.parse(line) do |fields|
      id, email, user_name, pwd_hash, full_name, api_key, active = fields
      
      legacy_id = id.to_i
      active = active == "NULL" ? nil : active.to_i

      if active && legacy_id && email && user_name && pwd_hash && full_name 
        user_attribs = {
          :legacy_id => legacy_id,
          :email => email,
          :user_name => user_name,
          :legacy_password_digest => pwd_hash,
          :full_name => full_name,
          :active => true
        }

        if api_key
          user_attribs[:api_key] = api_key
        end

        u = User.new(user_attribs)

        puts u.inspect 
      else
        rejects_file.puts(line)
      end
    end
  end
end

reject_file.close
