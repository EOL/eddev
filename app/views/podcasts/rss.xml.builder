summary = "Listen and learn about life as small as bacteria and as big as a bowhead whale. Our series includes over 70 podcasts, accompanied by resources such as transcripts, scientist interview, multi-media and lesson plans."
link_sentence = "These resources are available on the <a href='https://education.eol.org/podcasts'>EOL Learning + Education</a> website."

xml.instruct!("xml", version: "1.0", encoding: "UTF-8")
xml.rss("xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd", "xmlns:content": "http://purl.org/rss/1.0/modules/content/", version: "2.0") do
  xml.channel do
    xml.title("One Species at a Time")
    xml.tag!("itunes:subtitle", "Explore the diversity of life with One Species at a Time podcasts from the Encyclopedia of Life.")
    xml.description(summary)
    xml.tag!("itunes:summary", summary)
    xml.tag!("content:encoded") { xml.cdata!("#{summary} #{link_sentence}") }
    xml.tag!("itunes:category", text: "Science & Medicine") do
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
    xml.tag!("itunes:image", href: root_url + "images/podcasts/podcasts_logo_hi_res.png")
    xml.link(podcasts_url)

    @podcasts.each do |podcast|
      xml.item do
        xml.title(podcast.title)
        xml.tag!("itunes:title", podcast.title)
        xml.url(podcast.url)
        xml.guid(podcast.url)
        xml.description(podcast.clean_description)
        xml.tag!("itunes:summary", podcast.clean_description)

        if (podcast.description_has_html?)
          xml.tag!("content:encoded") { xml.cdata!(podcast.description) }
        else
          xml.tag!("content:encoded", podcast.description)
        end

        xml.enclosure(url: podcast.audio_url, type: "audio/mpeg", length: podcast.audio_size)
        xml.tag!("itunes:duration", podcast.duration_string)
      end
    end
  end
end

