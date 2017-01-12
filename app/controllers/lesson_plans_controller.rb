class LessonPlansController < ApplicationController
  PDFS_PATH = File.join(Rails.root, "files", "lesson_plans")

  def index
    @hero_image_partial = 'lesson_plans/hero'
    @scroll_to = params[:scroll_to]
  end

  def pdf
    @pdf_name = params[:pdf_name]

    send_file(File.join(PDFS_PATH, "#{@pdf_name}.pdf"),
      :type => "application/pdf",
      :disposition => "inline")
  end
end
