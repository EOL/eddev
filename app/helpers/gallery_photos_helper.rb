module GalleryPhotosHelper
  def licenses_for_select
    License.all.collect do |license|
      [t("models.license.name.#{license.translation_key}"), license.id]
    end
  end
end
