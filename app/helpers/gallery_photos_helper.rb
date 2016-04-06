module GalleryPhotosHelper
  def licenses_for_select
    License.all.collect do |license|
      [license.name, license.id]
    end
  end
end
