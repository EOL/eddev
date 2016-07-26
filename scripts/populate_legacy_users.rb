require "csv"
require "optparse"

PWD_HASH_REPLACEMENT = "<PASSWORD_HASH>"

def null_to_nil(fields)
  fields.each_with_index do |field, index|
    if field == '\N'
      fields[index] = nil
    end
  end
end

def scrub_line(line)
  line[3] = PWD_HASH_REPLACEMENT
  line
end

def scrub_user(user)
  user.legacy_password_digest = PWD_HASH_REPLACEMENT
  user
end

rejects_file = open(ARGV[0], "w")
rejects_file.puts("id, email, user_name, pwd_hash, full_name, api_key, active")

failed_validations_file = open(ARGV[1], "w")

User.transaction do
  $stdin.each do |line|
    CSV.parse(line) do |fields|
      puts null_to_nil(fields).inspect

      id, email, user_name, pwd_hash, full_name, api_key, active = null_to_nil(fields)
      legacy_id = id.to_i
      active = active.to_i

      if active && legacy_id && email && user_name && pwd_hash && full_name 
        user_attribs = {
          :legacy_id => legacy_id,
          :email => email,
          :user_name => user_name,
          :legacy_password_digest => pwd_hash,
          :full_name => full_name,
          :confirmed_at => DateTime.now
        }

        if api_key
          user_attribs[:api_key] = api_key
        end

        user = User.new(user_attribs)

        if !user.save
          failed_validations_file.puts(scrub_user(user).inspect) 
          failed_validations_file.puts(user.errors.messages.inspect)
        end
      else
        rejects_file.puts(scrub_line(line))
      end
    end
  end
end

rejects_file.close
failed_validations_file.close

    
