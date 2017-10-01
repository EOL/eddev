
class ImmutableCard {
  constructor(delegate) {
    this.delegate = delegate;
  }

  width = () => {
    return this.delegate.width();
  }

  height = () => {
    return this.delegate.height();
  }

  id = () => {
    return this.delegate.id();
  }

  isDirty = () => {
    return this.delegate.isDirty();
  }

  getUserDataRef = (fieldName) => {
    return this.delegate.getUserDataRef(fieldName);
  }

  getUserDataAttr = (fieldName, bucket, key) => {
    return this.delegate.getUserDataAttr(fieldName, bucket, key);
  }

  getChoiceIndex = (fieldName, defaultVal) => {
    return this.delegate.getChoiceIndex(fieldName, defaultVal);
  }

  getDataAttr = (fieldName, attr, defaultVal) => {
    return this.delegate.getDataAttr(fieldName, attr, defaultVal);
  }

  getFieldChoices = (fieldName) => {
    return this.delegate.getFieldChoices(fieldName);
  }

  getFieldChoiceTips = (fieldName) => {
    return this.delegate.getFieldChoiceTips(fieldName);
  }

  getImageLocation = (fieldName) => {
    return this.delegate.getImageLocation(fieldName);
  }

  editableFields = () => {
    return this.delegate.editableFields();
  }

  imageFields = () => {
    return this.delegate.imageFields();
  }

  resolvedFieldData = (field) => {
    return this.delegate.resolvedFieldData(field);
  }

  buildDrawingData = () => {
    return this.delegate.buildDrawingData();
  }

  getTemplateParam = (key) => {
    return this.delegate.getTemplateParam(key);
  }


  copyAndApply = (fn) => {
    const clone = this.delegate.clone();
    fn(clone);
    return new ImmutableCard(clone);
  }

  setDataAttr = (fieldName, attr, value) => {
    return this.copyAndApply((copy) => {
      copy.setDataAttr(fieldName, attr, value);
    });
  }

  setChoiceIndex = (fieldName, index) => {
    return this.copyAndApply((copy) => {
      copy.setChoiceIndex(fieldName, index);
    });
  }

  setUserDataAttr = (fieldName, bucket, key, value) => {
    return this.copyAndApply((copy) => {
      copy.setUserDataAttr(fieldName, bucket, key, value);
    });
  }

  setUserDataRef = (fieldName, key) => {
    return this.copyAndApply((copy) => {
      copy.setUserDataRef(fieldName, key);
    });
  }

  setDataAttrNotDirty = (fieldName, attr, value) => {
    return this.copyAndApply((copy) => {
      copy.setDataAttrNotDirty(fieldName, attr, value);
    });
  }

  setKeyValText = (fieldName, keyOrVal, index, value) => {
    return this.copyAndApply((copy) => {
      copy.setKeyValText(fieldName, keyOrVal, index, value);
    });
  }

  forceDirty = () => {
    return this.copyAndApply((copy) => {
      copy.forceDirty();
    });
  }

  save = (cb) => {
    return this.copyAndApply((copy) => {
      copy.save((err) => {
        if (err) return cb(err);
        cb(null, new ImmutableCard(copy));
      });
    });
  }
}

function newInstance(data, cb) {
  CardWrapper.newInstance(data, (err, cardWrapper) => {
    if (err) return cb(err);
    cb(null, new ImmutableCard(cardWrapper));
  });
}

export default newInstance;
