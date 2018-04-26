/* global particlesJS */

$(document).ready(function(){

  particlesJS('particles-js', {
    'particles': {
      'number': {
        'value': 100,
        'density': {
          'enable': true,
          'value_area': 700
        }
      },
      'color': {
        'value': 'random'
      },
      'shape': {
        'type': 'circle',
        'stroke': {
          'width': 0,
          'color': '#000000'
        },
        'polygon': {
          'nb_sides': 5
        },
        'image': {
          'src': 'img/github.svg',
          'width': 100,
          'height': 100
        }
      },
      'opacity': {
        'value': 0.5,
        'random': false,
        'anim': {
          'enable': false,
          'speed': 2,
          'opacity_min': 0.1,
          'sync': false
        }
      },
      'size': {
        'value': 6,
        'random': true,
        'anim': {
          'enable': false,
          'speed': 40,
          'size_min': 0.1,
          'sync': false
        }
      },
      'line_linked': {
        'enable': false,
        'distance': 150,
        'color': '#ffffff',
        'opacity': 0.4,
        'width': 1
      },
      'move': {
        'enable': true,
        'speed': 1,
        'direction': 'none',
        'random': false,
        'straight': false,
        'out_mode': 'out',
        'bounce': false,
        'attract': {
          'enable': false,
          'rotateX': 600,
          'rotateY': 1200
        }
      }
    },
    'retina_detect': true
  });

  if (document.querySelector('.my-slick')) {
    $('.my-slick').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        }
      ]
    });
  }

  /* global filestack */

  const client = filestack.init('Ah2KpY6HNTrWeqrIKMLcwz');
  function uploadImage(e) {
    client.pick({
      accept: 'image/*',
      maxFiles: 1,
      transformations: { crop: { force: true, aspectRatio: 4/4 } }
    })
      .then(res => $(e.target).siblings('[type=hidden]').val(res.filesUploaded[0].url));
  }

  $(() => {
    const uploadBtn = $('button.image-upload');
    uploadBtn.on('click', uploadImage);
  });

  // STARS
  // if star{number} is cicked, change the value of the input to {number}
  const $ratingValue = $('.ratingValue');
  const $stars = $('[name=rating]');

  $stars.change(function(e) {
    $ratingValue.val($(e.target).val());
  });


});
// map
/* global google  */

function initMap() {
  // set attributes as 'data-whatever' to access in javascript by document.getElement().dataset.whatever
  // here we've used JSON.stringify to turn the object into a string (which we will then JSON.parse in JavaScript)
  const venue = JSON.parse(document.getElementById('map').dataset.location);
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 20,
    center: venue
  });
  new google.maps.Marker({
    position: venue,
    map: map
  });
}


window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('map')) initMap();
});
