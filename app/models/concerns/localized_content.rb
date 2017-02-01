module LocalizedContent
  extend ActiveSupport::Concern
  
  class_methods do
    def has_content_keys(*key_names)
      key_names.each do |key_name|
        define_method "localized_#{key_name}" do
          key_val = read_attribute "#{key_name}_key"

          if key_val.present?
            I18n.translate(
              "models.#{model_name.param_key}.#{key_name}s.#{key_val}"
            )
          else
            nil
          end
        end
      end
    end
  end
end
