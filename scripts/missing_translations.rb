#!/usr/bin/env ruby

require 'yaml'
require 'json'
require 'optparse'

JSON_EXT = ".json"
ROOT_KEY = "root"

def filter(h)
  if h.is_a?(Hash)
    result = {}

    h.each do |k,v|
      filtered = filter(v)
      if filtered
        result[k] = filtered
      end
    end

    result = nil if result.empty?
  elsif h
    result = h 
  else
    result = nil
  end

  return result
end


options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: missing_translations.rb [options]"

  opts.on("--keys FILENAME") do |fname|
    options[:keys_file] = fname
  end

  opts.on("--translations FILENAME") do |fname|
    options[:trans_file] = fname
  end
end.parse!


File.open(options[:keys_file]) do |keys_file|
  File.open(options[:trans_file]) do |trans_file|
    mode = if options[:trans_file].end_with?(JSON_EXT)
             :json
           else
             :yaml
           end

    raw_translations = trans_file.read
    translations = if mode == :json
                     JSON.parse(raw_translations)
                   else
                     YAML.load(raw_translations)
                   end

    trans_keys = translations.keys
    root_key = nil
    
    if trans_keys.length == 1
      root_key = trans_keys.first
    end

    keys_file.each do |key|
      prev_trans = {}
      cur_trans = translations
      parts = key.split(".")

      parts.each do |part|
        if part == ROOT_KEY
          part = root_key
        end
        part = part.strip

        prev_trans = cur_trans
        cur_trans = prev_trans[part]

        break if !cur_trans
      end

      if cur_trans
        prev_trans.delete(parts.last.strip) do |key|
          throw "key #{key} not found in #{prev_trans}"
        end
      end
    end

    filtered = filter(translations)

    if mode == :json
      puts JSON.pretty_generate(filtered)
    else
      puts YAML.dump(filtered)
    end
  end
end

