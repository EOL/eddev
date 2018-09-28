xml.rss("xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd", version: "2.0") do
  xml.channel do
    xml.title("One Species at a Time")
    xml.link(podcasts_url)
    xml.description("\"One Species at a Time\" podcasts from the EOL Learning + Education group")

    @podcasts.each do |podcast|
      xml.item do
        xml.title(podcast.title)
        xml.url(podcast.anchor_url)
        xml.description(podcast.description)
        xml.enclosure(url: podcast.audio_url, type: "audio/mpeg", length: podcast.audio_size)
        xml.guid(podcast.perm_id)
        xml.tag!("itunes:duration", podcast.duration_string)
      end
    end
  end
end
