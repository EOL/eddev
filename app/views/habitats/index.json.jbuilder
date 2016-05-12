json.array!(@habitats) do |habitat|
  json.extract! habitat, :id, :name
  json.url habitat_url(habitat, format: :json)
end
