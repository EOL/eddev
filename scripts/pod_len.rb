require 'taglib'
require 'csv'

CSV.read("db/seed_data/podcasts.tsv", col_sep: "\t", headers: true).each do |line|
  file_name = line["audio_file_name"]
  file_path = "public/podcasts/audio/#{file_name}"

  TagLib::FileRef.open(file_path) do |fileref|
    puts "#{fileref.audio_properties.length}"
  end
end

