summary = "Listen and learn about life as small as bacteria and as big as a bowhead whale. Our series includes over 70 podcasts, accompanied by resources such as transcripts, scientist interview, multi-media and lesson plans. These resources are available at https://education.eol.org/podcasts."

xml.rss("xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd", version: "2.0") do
  xml.channel do
    xml.title("One Species at a Time")
    xml.tag!("itunes:subtitle", "Explore the diversity of life with One Species at a Time podcasts from the Encyclopedia of Life.")
    xml.description(summary)
    xml.tag!("itunes:summary", summary)
    xml.tag!("content:encoded") { xml.cdata!("Listen and learn about life as small as bacteria and as big as a bowhead whale. Our series includes over 70 podcasts, accompanied by resources such as transcripts, scientist interview, multi-media and lesson plans. These resources are available at the <a href='https://education.eol.org/podcasts'>EOL Learning + Education</a> site.") }
    xml.tag!("itunes:category", text: "Science &amp; Medecine") do
      xml.tag!("itunes:category", text: "Natural Sciences")
    end
    xml.copyright("The One Species at a Time podcast series was produced by Ari Daniel Shapiro and Atlantic Public Media, in cooperation with the Encyclopedia of Life Learning + Education group located at the Harvard Museum of Comparative Zoology. Narrated by Ari Daniel Shapiro. CC BY-NC")
    xml.tag!("itunes:author", "Encyclopedia of Life")
    xml.tag!("itunes:explicit", "no")
    xml.tag!("itunes:owner") do
      xml.tag!("itunes:email", "learning@eol.org")
      xml.tag!("itunes:name", "EOL Learning + Education Group")
    end
    xml.language("en")
    xml.link(podcasts_url)

    @podcasts.each do |podcast|
      xml.item do
        xml.title(podcast.title)
        xml.tag!("itunes:title", podcast.title)
        xml.url(podcast_url(slug: podcast.perm_id))
        xml.description(podcast.description)
        xml.tag!("itunes:summary", podcast.description)
        xml.enclosure(url: podcast.audio_url, type: "audio/mpeg", length: podcast.audio_size)
        xml.guid(podcast.perm_id)
        xml.tag!("itunes:duration", podcast.duration_string)
      end
    end
  end
end
