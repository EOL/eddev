var template = window.Trait;

$(function() {
  var canvas = $('#Canvas')[0],
      ctx = canvas.getContext('2d'),
      leatherbackImg = $('#LeatherbackPhoto')[0];

  ctx.canvas.width = template.width();
  ctx.canvas.height = template.height();

  console.log(leatherbackImg);

  Trait.draw(canvas, {
    'commonName': 'Leatherback Sea Turtle',
    'sciName': 'Dermocheyls coriacea',
    'image': leatherbackImg
  });
});
