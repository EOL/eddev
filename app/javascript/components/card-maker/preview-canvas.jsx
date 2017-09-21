import React from 'react'

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

class PreviewCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      handleDrag: null,
      mouseInImage: false,
    }
  }

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
    if (this.renderer && this.props.card) {
      this.renderer.draw(this.props.card, function(err) {
        if (err) console.log(err);
      });
    }
  }

  imageContains = (event) => {
    const dragArea = this.props.card && this.props.selectedImgId ?
      this.props.card.getImageLocation(this.props.selectedImgId) :
      null
    ;

    if (!dragArea) {
      return false;
    } else {
      let minX = dragArea.x
        , minY = dragArea.y
        , maxX = minX + dragArea.width
        , maxY = minY + dragArea.height
        , canvasOffset = $(this.canvas).offset()
        , mouseX = event.pageX - canvasOffset.left
        , mouseY = event.pageY - canvasOffset.top
        ;

      return (
        mouseX >= minX &&
        mouseX <= maxX &&
        mouseY >= minY &&
        mouseY <= maxY
      );
    }
  }

  handleMouseDown = (clickEvent) => {
    if (!this.imageContains(clickEvent)) {
      return;
    }

    let panX = this.props.getImageData('panX', 0)
      , panY = this.props.getImageData('panY', 0)
      , clickX = clickEvent.pageX
      , clickY = clickEvent.pageY
      ;

    this.setState((prevState, props) => {
      return {
        handleDrag: (e) => {
          this.props.setImageData('panX', panX + clickX - e.pageX);
          this.props.setImageData('panY', panY + clickY - e.pageY);
        },
      }
    })
  }

  handleMouseUp = (event) => {
    if (this.state.handleDrag) {
      this.setState((prevState, props) => {
        return {
          handleDrag: null,
        }
      });
    }
  }

  handleMouseMove = (event) => {
    if (this.imageContains(event)) {
      this.setState((prevState, props) => {
        return {
          mouseInImage: true,
        }
      });
    } else if (this.state.mouseInImage) {
      this.setState((prevState, props) => {
        return {
          mouseInImage: false,
        }
      });
    }

    if (this.state.handleDrag) {
      this.state.handleDrag(event);
    }
  }

  getStyle = () => {
    var style = {};

    if (this.state.mouseInImage) {
      style.cursor = 'move';
    } else {
      style.cursor = 'auto';
    }

    return style;
  }

  render() {
    this.draw();

    return (
      <canvas
        id='CardCanvas'
        className='card-canvas'
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        style={this.getStyle()}
        ref={this.setCanvas}
      />
    )
  }
}

export default PreviewCanvas
