import React from 'react'

class UserResource extends React.Component {
  constructor() {
    super();

    // Method implementation checks go here
  }

  imgUrl() {
    UserResource.throwNotImplemented();
  }

  static throwNotImplemented() {
    throw new TypeError('Not implemented')
  }
}
