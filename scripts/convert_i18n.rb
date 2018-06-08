#!/usr/bin/env ruby

require 'yaml'
require 'json'
require 'csv'
require 'optparse'

def flatten(h)
  result = {}

  h.each do |k, v|
    if v.is_a? Hash
      flat = flatten(v)

      flat.each do |fk, fv|
        result["#{k}.#{fk}"] = fv
      end
    else
      result[k] = v    
    end
  end

  result
end

def expand(h)
  result = {}

  h.each do |k, v|
    cur = result
    kParts = k.split(".")

    kParts.each_with_index do |part, i|
      if i < kParts.length - 1
        cur[part] = cur[part] || {}
        cur = cur[part]
      else
        cur[part] = v
      end
    end
  end

  result
end

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: convert_i18n.rb [options]"

  opts.on("--file FILENAME") do |fname|
    options[:fname] = fname
  end

  opts.on("--to-tsv") do 
    options[:to_tsv] = true
  end
  
  opts.on("--from-tsv-to TYPE") do |type|
    options[:from_tsv_to] = type
  end
end.parse!

File.open(options[:fname]) do |raw|
  raw_str = raw.read
  if (options[:to_tsv])
    parsed = if options[:fname].end_with? ".json"
      JSON.parse(raw_str) 
    elsif options[:fname].end_with? ".yml"
      YAML.load(raw_str)
    else
      raise "unsupported file extension"
    end

    flat = flatten(parsed)

    csv = CSV.generate(:col_sep => "\t") do |csv_out|
      flat.each do |k, v|
        csv_out << [k, v]
      end
    end

    puts csv
  else
    rows = CSV.parse(raw_str, :col_sep => "\t", :liberal_parsing => true)
    flat = rows.to_h
    expanded = expand(flat)

    dest_type = options[:from_tsv_to]

    result = if (dest_type == "json")
      JSON.pretty_generate(expanded)
    elsif (dest_type == "yml")
      YAML.dump(expanded)
    else
      raise "unsupported --from-tsv-to value #{dest_type}"
    end

    puts result
  end
end
