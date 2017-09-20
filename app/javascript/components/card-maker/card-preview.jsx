import React from 'react'

import ImageControlButtons from './image-control-buttons'
import ImageZoomControls from './image-zoom-controls'

// http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas/15666143#15666143
const pixelRatio = (function () {
  var ctx = document.createElement('canvas').getContext('2d'),
      dpr = window.devicePixelRatio || 1,
      bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();

/*
 * Image fetcher for TemplateRenderer
 */
const imageFetcher = {
  fetch: function(url, cb) {
    var img = new Image()
      , $img = $(img);

    $img.on('load', function() {
      cb(null, img)
    });
    $img.on('error', function() {
      cb(new Error("Failed to load image for url " + url));
    });
    $img.attr({
      src: url
    });
  }
}

const selectedImgId = 'mainPhoto';

class CardPreview extends React.Component {
  setCanvas = (canvas) => {
    this.canvas = canvas;

    const canvasSupplier = {
      drawingCanvas: (width, height) => {
        this.canvas.width = width * pixelRatio;
        this.canvas.height = height * pixelRatio;

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        this.canvas.getContext('2d').setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        return this.canvas;
      },
      transformCanvas: (width, height) => {
        var $canvas = $('<canvas>');
        $canvas.attr('width', width);
        $canvas.attr('height', height);

        return $canvas[0];
      }
    }

    this.renderer = new TemplateRenderer(canvasSupplier, imageFetcher)
  }

  draw = () => {
    console.log('renderer', this.renderer);
    console.log('card', this.props.card);

    if (this.renderer && this.props.card) {
      this.renderer.draw(this.props.card, function(err) {
        if (err) console.log(err);
      });
    }
  }

  getImageData = (attr, defaultVal) => {
    return this.props.getCardData(selectedImgId, attr, defaultVal);
  }

  setImageData = (attr, val) => {
    this.props.setCardData(selectedImgId, attr, val);
  }

  render() {
    this.draw();

    return (
      <div className='preview'>
        <div className='img-select'></div>
        <div className='controls-card-wrap'>
          <div className='img-controls'>
            <ImageControlButtons
              setImageData={this.setImageData}
              getImageData={this.getImageData}
            />
            <div className='sep'></div>
            <ImageZoomControls
              setImageData={this.setImageData}
              getImageData={this.getImageData}
            />
          </div>
          <div className='card-box'>
            <canvas id='CardCanvas' className='card-canvas' ref={this.setCanvas}/>
            <a href='#' target='_blank' className='eol-link'>
              <span>Open </span>
              <i className='icon-eol-logo' />
              <span> taxon page</span>
            </a>
          </div>
          <div className='preview-btns'>
            <div className='btn close'>
              <div className='btn-txt'>Close</div>
            </div>
            <div className='btn save-exit'>
              <div className='btn-txt'>Save + Exit</div>
            </div>
            <div className='btn save'>
              <div className='btn-txt'>Quick Save</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CardPreview;
