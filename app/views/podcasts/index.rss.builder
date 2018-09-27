xml.rss(version: "2.0") do
  xml.channel do
    xml.title("One Species at a Time")
    xml.link(podcasts_url)
    xml.description("\"One Species at a Time\" podcasts from the EOL Learning + Education group")

    @podcasts.each do |podcast|
      xml.item do
        xml.title(podcast.title)
        xml.link(podcast.audio_url)
        xml.description(podcast.description)
        xml.guid(podcast.audio_url)
      end
    end
  end
end
