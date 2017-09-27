import React from 'react'

import fieldWrapper from './field-wrapper'

const maxImgLibPreviewThumbs = 3;

class ImageField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libOpen: false,
      uploadInFlight: false,
      inFlightLoadUrl: null,
      urlLoadError: false,
    }
  }

  buildImgLibPreviewThumbs = () => {
    const thumbs = []
        , numThumbs = Math.min(Math.max(
            this.props.choices.length, maxImgLibPreviewThumbs
          ), maxImgLibPreviewThumbs)
        ;

    for (let i = 0; i < numThumbs; i++) {
      let thumbUrl = this.props.choices[i].thumbUrl;
      thumbs.push(<img src={thumbUrl} className='img-lib-thumb' key={i}/>);
    }

    return thumbs;
  }

  handleLibOpenClick = () => {
    this.setState(() => {
      return {
        libOpen: true,
      }
    });
  }

  handleLibCloseClick = () => {
    this.setState(() => {
      return {
        libOpen: false,
      }
    })
  }

  setUserImage = (bucket, url) => {
    this.props.setUserDataAttr(bucket, 'url', url);
    this.props.setUserDataAttr(bucket, 'thumbUrl', url);
    this.props.setUserDataRef(bucket);
  }

  handleFileInputChange = (event) => {
    const file = this.fileInputNode.files[0];

    this.setState(() => {
      return {
        uploadInFlight: true,
      }
    });

    $.ajax({
      url: '/card_maker_ajax/images',
      method: 'POST',
      data: file,
      contentType: 'application/octet-stream',
      processData: false,
      success: (data) => {
        this.setUserImage('upload', data.url);
        this.setState(() => {
          return {
            uploadInFlight: false,
          }
        })
      },
      error: (err) => {
        alert('Something went wrong. Please try again later.');
        this.setState(() => {
          return {
            uploadInFlight: false,
          }
        })
      }
    });
  }

  handleUploadThumbClick = () => {
    if (!this.state.uploadInFlight) {
      this.props.setUserDataRef('upload');
    }
  }

  handleUrlThumbClick = () => {
    if (!this.state.inFlightLoadUrl) {
      this.props.setUserDataRef('fromUrl')
    }
  }

  handleUrlBtnClick = () => {
    this.setState(() => {
      return {
        inFlightLoadUrl: this.urlInputNode.value,
        urlLoadError: false,
      }
    })
  }

  handleUrlImgLoad = () => {
    if (this.state.inFlightLoadUrl) {
      this.setUserImage('fromUrl', this.state.inFlightLoadUrl);
      this.setState(() => {
        return {
          inFlightLoadUrl: null,
        }
      })
    }
  }

  handleUrlImgError = () => {
    this.setState(() => {
      return {
        inFlightLoadUrl: null,
        urlLoadError: true,
      }
    })
  }

  buildUrlThumb = () => {
    const urlThumbUrl = this.props.getUserDataAttr('fromUrl', 'thumbUrl')
        , url = urlThumbUrl || this.state.inFlightLoadUrl
        ;

    if (!(url)) {
      return '';
    }

    let imgClassName = 'img'
      , rootClassName = 'url-img-preview thumb'
      ;

    if (this.state.inFlightLoadUrl) {
      imgClassName += ' hidden';
    }

    if (this.props.userDataRef === 'fromUrl') {
      rootClassName += ' selected';
    }

    return (
      <div className={rootClassName} onClick={this.handleUrlThumbClick}>
        {this.state.inFlightLoadUrl &&
          <i className='fa fa-spinner fa-lg fa-spin spinner' />
        }
        <img
          className={imgClassName}
          src={url}
          onLoad={this.handleUrlImgLoad}
          onError={this.handleUrlImgError}
        />
      </div>
    )
  }

  handleCreditInputChange = (event) => {
    this.props.setDataAttr('credit', { text: event.target.value });
  }

  render() {
    const uploadThumbUrl = this.props.getUserDataAttr('upload', 'thumbUrl');
    let uploadThumbClassName = 'upload-img-preview thumb';

    if (this.props.userDataRef === 'upload') {
      uploadThumbClassName += ' selected';
    }

    return (
      <div>
      {!this.state.libOpen &&
        (<div className='img-field-main'>
          <div className='img-lib-link img-field-sec' onClick={this.handleLibOpenClick}>
            <div className='img-lib-hdr img-lib-btn'>Image Library</div>
            <div className='img-lib-thumbs'>
              {this.buildImgLibPreviewThumbs()}
            </div>
          </div>
          <div className='img-field-sep'></div>
          <div className='img-url img-field-sec'>
            <div className='img-or'>or</div>
            <div className='img-url-wrap flex-wrap'>
              <input
                className='img-url-input text-input text-entry'
                type='text'
                placeholder='Type/paste URL'
                ref={(node) => this.urlInputNode = node}
              />
              <div
                className='img-url-btn text-input-btn'
                onClick={this.handleUrlBtnClick}
              >
                <i className='fa fa-upload fa-lg' />
              </div>
            </div>
            {this.state.urlLoadError &&
              <div className='img-url-error'>Failed to load image from URL</div>
            }
            {this.buildUrlThumb()}
          </div>
          <div className='img-field-sep'></div>
          <div className='img-upload img-field-sec'>
            <div className='img-or'>or</div>
            <div className='img-upload-btn' onClick={() => this.fileInputNode.click() }>
              <i className='fa fa-upload fa-lg img-upload-btn-icon' aria-hidden='true'/>
              <div className='img-upload-btn-txt'>Upload an image</div>
              <input
                className='img-upload-file'
                type='file'
                onChange={this.handleFileInputChange}
                ref={(node) => this.fileInputNode = node}
              />
            </div>
            {(this.state.uploadInFlight || uploadThumbUrl != null) &&
              (<div
                className={uploadThumbClassName}
                onClick={this.handleUploadThumbClick}
               >
                {this.state.uploadInFlight ?
                  (<i className='fa fa-spinner fa-lg fa-spin spinner' />) :
                  (<img className='img' src={uploadThumbUrl} />)
                }
              </div>)
            }
          </div>
          <div className='img-field-sep'></div>
          <div className='img-credit img-field-sec'>
            <div className='img-credit-label'>Image Credit</div>
            <input
              className='img-credit-input text-input text-entry'
              type='text'
              value={this.props.getDataAttr('credit', {}).text || ''}
              onChange={this.handleCreditInputChange}
            />
          </div>
        </div>)
      }
      {this.state.libOpen &&
        (<div className='img-lib-expanded'>
          <div className='img-thumbs'>
            {this.props.choices.map((choice, i) => {
              return (
                <img
                  src={choice.thumbUrl}
                  className='img-thumb'
                  key={i}
                  onClick={() => this.props.setChoiceIndex(i)}
                />
              );
            })}
          </div>
          <div className='back-btn img-lib-btn' onClick={this.handleLibCloseClick}>Close image library</div>
        </div>)
      }
      </div>
    )
  }
}

/*
.img-field-main
  .img-lib-link.img-field-sec
    .img-lib-hdr.img-lib-btn Image Library
    .img-lib-thumbs
      :plain
        {{#each pc.thumbUrls}}
          <img src="{{this}}" class="img-lib-thumb">
        {{/each}}
  .img-field-sep
  .img-url.img-field-sec
    .img-or or
    .img-url-wrap.flex-wrap
      %input.img-url-input.text-input.text-entry{:type => :text, :placeholder => "Type/paste URL"}>
      .img-url-btn.text-input-btn
        %i.fa.fa-upload.fa-lg
    .img-url-error.hidden Failed to load image from URL
    .url-img-preview.thumb.hidden
      %img.img
  .img-field-sep
  .img-upload.img-field-sec
    .img-or or
    .img-upload-btn
      %i.fa.fa-upload.fa-lg.img-upload-btn-icon{:'aria-hidden' => true}
      .img-upload-btn-txt Upload an image
      %input.img-upload-file{:type => "file"}
    .upload-img-preview.thumb.hidden
      %img.img
  .img-field-sep
  .img-credit.img-field-sec
    .img-credit-label Image Credit
    %input.img-credit-input.text-input.text-entry{:type => :text}
.img-lib-expanded.hidden
  .img-thumbs
    :plain
      {{#each pc.choices}}
        <img src="{{this.thumbUrl}}" data-index="{{@index}}" class="img-thumb">
      {{/each}}
  .back-btn.img-lib-btn Close image library
*/
export default fieldWrapper(ImageField)
