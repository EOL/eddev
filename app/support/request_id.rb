module RequestId
  def self.get
    Thread.current[:request_id]
  end

  def self.set(request_id)
    Thread.current[:request_id] = request_id
  end
end
