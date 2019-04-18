jQuery(document).ready(function($) {

    // $('.overlay').fadeOut('slow');
    var overlayTl = new TimelineMax(),
        $overlay = $('.overlay');
        // $imgContainer = $('.img-container'),
        // $loadContainer = $('.load-container'),
        // $loadContainerBar = $('.load-container-bar');

        // overlayTl
        //     .set($imgContainer, {autoAlpha: 0, y: '-=30px'})
        //     .set($loadContainer, { autoAlpha: 0, y: '-=30px' })
        //     .set($loadContainerBar, { width: '0px' });

        overlayTl
            // .to($loadContainer, 0.750, { autoAlpha: 1, y: "+=30px", ease: Power4.easeInOut })
            // .to($imgContainer, 0.750, { autoAlpha: 1, y: "+=30px", ease: Power4.easeInOut }, '-=0.5')
            // .to($loadContainerBar, 0.750, { width: '70px', ease: Power0.easeNone }, '+=0.750')
            // .to($loadContainerBar, 0.750, { width: '90px', ease: Power0.easeNone })
            // .to($loadContainerBar, 0.1, { width: '112px', ease: Power0.easeNone })

            // .to($loadContainerBar, 0.250, { opacity: 0.5, ease: Power0.easeNone })
            // .to($loadContainerBar, 0.250, { opacity: 1, ease: Power0.easeNone })

            // .to($loadContainer, 0.750, { autoAlpha: 0, y: "+=30px", ease: Back.easeInOut })
            // .to($imgContainer, 0.750, { autoAlpha: 0, y: "+=30px", ease: Back.easeOut }, '-=0.26');
            // .to($overlay, 0.5, { autoAlpha: 0, ease: Power4.easeInOut }, '-=0.75');
            .to($overlay, 0.5, { autoAlpha: 0, ease: Power4.easeInOut }, '+=1.00');

    
    
    Barba.Pjax.start();
    var FadeTransition = Barba.BaseTransition.extend({
        start: function() {
            /**
             * This function is automatically called as soon the Transition starts
             * this.newContainerLoading is a Promise for the loading of the new container
             * (Barba.js also comes with an handy Promise polyfill!)
             */

            // As soon the loading is finished and the old page is faded out, let's fade the new page
            Promise
            .all([this.newContainerLoading, this.fadeOut()])
            .then(this.fadeIn.bind(this));
        },

        fadeOut: function() {
            /**
             * this.oldContainer is the HTMLElement of the old Container
             */

            return $(this.oldContainer).animate({ opacity: 0 }).promise();
        },

        fadeIn: function() {
            /**
             * this.newContainer is the HTMLElement of the new Container
             * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
             * Please note, newContainer is available just after newContainerLoading is resolved!
             */

            var _this = this;
            var $el = $(this.newContainer);

            $(this.oldContainer).hide();

            $el.css({                     
            visibility : 'visible',
            opacity : 0
            });

            $el.animate({ opacity: 1 }, 400, function() {
            /**
             * Do not forget to call .done() as soon your transition is finished!
             * .done() will automatically remove from the DOM the old Container
             */

            _this.done();
            closeMenuIfMobile();
            initSliders();
            });
        }
    });
    /**
     * Next step, you have to tell Barba to use the new Transition
     */
    Barba.Pjax.getTransition = function() {
        /**
         * Here you can use your own logic!
         * For example you can use different Transition based on the current page or link...
         */
        return FadeTransition;
    };

    function initSliders(){
        $('.slider').owlCarousel({
            //loop: true,
            loop: true,
            margin: 0,
            nav: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 1
                }
            }
        });
    }

    function closeMenuIfMobile(){ 
        if ($(window).width() < 768 && $('body').hasClass('menu-open')) {
            setTimeout(function () {
                $('.close-icon').trigger('click');
            }, 1000);

        }
    }

    $('.menu-toggle').click(function () {
        $('body').toggleClass('menu-open');
    }); 
        
    var glyphOutTl = new TimelineMax(),
    glyphInTl = new TimelineMax(),
    $flips = $('.flip'),
    $body = $('body');

    clearStage();
    function clearStage() {
        var clearTl = new TimelineMax(),
            glyphActiveN = $('.link.is-active').find('.count').html();
            
        clearTl
            // .set($flip00, { transformOrigin: 'center center' })
            .set($flips, { autoAlpha: 0, rotationY: 90 });

        glyphIn(glyphActiveN);
        return clearTl;
    }
    $('.link:not(.is-disabled)').click(function () { 
        if($body.hasClass('is-animating'))
        {}
        else
        {
            var o = $('.link.is-active').find('.count').html();
            var i = $(this).find('.count').html();
            $('.link.is-active').removeClass('is-active');
            $(this).addClass('is-active');
        }
        glyphOut(o, i);
    }); 
    function glyphOut(o, i){
        var glyphOuting = '.flip-' + o;
        // console.log(o);
        glyphOutTl 
        .set($body, { className: '+=is-animating' })
        .to($(glyphOuting), 1, { autoAlpha: 0, rotationY: 90, ease: Power4.easeInOut, onComplete: glyphIn, onCompleteParams: [i] });
    }
    function glyphIn(i) {
        // console.log(i);
        var glyphInning = '.flip-' + i;
        // console.log(i + ' va rentrer');

        glyphInTl
        .to($(glyphInning), 1, { autoAlpha: 1, rotationY: 0, ease: Power4.easeInOut })
        .set($body, { className: '-=is-animating' });
    }

    $('#gobackup').click(function () { 
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    }); 

    $('#barba-wrapper').on('click', '.themelist article:not(.is-disabled) a', function (e) {
        var themeTriggered = 'c' + $(this).data('menu');
        console.log(themeTriggered);
        var url = $(this).attr('href');
        $('nav ul li.' + themeTriggered).trigger('click');
        Barba.Pjax.goTo(url);
        e.preventDefault();
        return false;
    }); 



          // var mainTl = new TimelineMax({ onUpdate: updateSlider, paused: true }),
          //   $text = $('p'),
          //   $sceneControls = $('.scene-controls'),
          //   $svg = $('#scene svg'),
          //   $background = $('#background'),
          //   $soleil = $('#soleil'),
          //   $soleil2 = $('#soleil2'),
          //   $soleil2p1 = $('#soleil2 .path1'),
          //   $soleil2p2 = $('#soleil2 .path2'),
          //   $soleil2p3 = $('#soleil2 .path3'),
          //   $soleil2p4 = $('#soleil2 .path4'),
          //   $three1 = $('#three1'),
          //   $three2 = $('#three2'),
          //   $three3 = $('#three3'),
          //   $three4 = $('#three4'),
          //   $three5 = $('#three5'),
          //   $three6 = $('#three6'),
          //   $napoleome = $('#napoleome'),
          //   $grass = $('#grass'),
          //   $bourgeon1 = $('#bourgeon1 ellipse'),
          //   $bourgeon1Caption = $('#bourgeon1-caption'),
          //   $branche1a = $('#branche1a'),
          //   $branche1b = $('#branche1b'),
          //   $bourgeon2 = $('#bourgeon2 ellipse'),
          //   $branche2a = $('#branche2a'),
          //   $branche2b = $('#branche2b'),
          //   $branche1c = $('#branche1c'),
          //   $branche1d = $('#branche1d'),
          //   $uv = $('#uv'),
          //   $uvp1 = $('#uv .path1'),
          //   $uvp2 = $('#uv .path2'),
          //   $uvp3 = $('#uv .path3'),
          //   $uvp4 = $('#uv .path4'),
          //   $uvp5 = $('#uv .path5'),
          //   $uvp6 = $('#uv .path6'),
          //   $uvp7 = $('#uv .path7'),
          //   $uvp8 = $('#uv .path8'),
          //   $uvp9 = $('#uv .path9'),
          //   $uvp10 = $('#uv .path10'),
          //   $uvCaption = $('#uv-caption'),
          //   $branche3 = $('#branche3 path'),
          //   $branche4 = $('#branche4 path'),
          //   $branche5 = $('#branche5 path'),
          //   $branche6 = $('#branche6 path');

          // function clearStage() {
          //   var clearTl = new TimelineMax();

          //   clearTl
          //     .set($text, { autoAlpha: 0, y: '-=10px' })
          //     .set($soleil2, { autoAlpha: 1, x: '-=190px', y: '+=150px', transformOrigin: 'center center' })
          //     .set($soleil2p1, { scale: 0, transformOrigin: 'center center' })
          //     .set($soleil2p2, { scale: 0, transformOrigin: 'center center' })
          //     .set($soleil2p3, { scale: 0, transformOrigin: 'center center' })
          //     .set($soleil2p4, { scale: 0, transformOrigin: 'center center' })
          //     .set($bourgeon1, { autoAlpha: 1, fill: '#a86c2f', transformOrigin: 'left center', scale: 0 })
          //     .set($bourgeon1Caption, { autoAlpha: 0 })
          //     .set($branche1a, { autoAlpha: 1, scale: 0, transformOrigin: 'left center' })
          //     .set($branche1b, { autoAlpha: 1, scale: 0, transformOrigin: 'left center' })
          //     .set($bourgeon2, { autoAlpha: 1, fill: '#91238c', transformOrigin: 'center bottom', scale: 0 })
          //     .set($branche2a, { autoAlpha: 1, scale: 0, transformOrigin: 'center bottom' })
          //     .set($branche2b, { autoAlpha: 1, scale: 0, transformOrigin: 'left bottom' })
          //     .set($branche1c, { autoAlpha: 1, scale: 0, transformOrigin: 'center bottom' })
          //     .set($branche1d, { autoAlpha: 1, scale: 0, transformOrigin: 'left center' })
          //     .set([$uvp1, $uvp2, $uvp3, $uvp4, $uvp5, $uvp6, $uvp7, $uvp8, $uvp9, $uvp10,], { autoAlpha: 0 })
          //     .set($uvCaption, { autoAlpha: 0 })
          //     .set($branche3, { autoAlpha: 1, scale: 0, transformOrigin: 'left center' })
          //     .set($branche4, { autoAlpha: 1, scale: 0, transformOrigin: 'left center' })
          //     .set($branche5, { autoAlpha: 1, scale: 0, transformOrigin: 'left center' })
          //     .set($branche6, { autoAlpha: 1, scale: 0, transformOrigin: 'left center' })
          //     .set($grass, { transformOrigin: 'center top' })
          //     .set($napoleome, { transformOrigin: 'center center' });

          //   return clearTl;
          // }

          // function zoomIntoTree() {
          //   var zoomIntoTreeTl = new TimelineMax();

          //   zoomIntoTreeTl
          //     .to($grass, 0.8, { y: '+=200px', scale: 2, ease: Power4.easeInOut })
          //     .to($background, 0.8, { autoAlpha: 0, ease: Power4.easeInOut })
          //     .staggerTo([$three1, $three2, $three3, $three4, $three5, $three6], 0.8, { autoAlpha: 0, y: '+=50px' }, 0.250)
          //     .to($napoleome, 0.8, { scale: 6, y: '-=450px', ease: Power4.easeInOut })
          //     .to($bourgeon1, 1.2, { scale: 1, ease: Bounce.easeOut })
          //     .to($bourgeon1Caption, 0, { autoAlpha: 1 })
          //     .to($bourgeon1Caption, 1, { y: '+=50px', autoAlpha: 0, ease: Power4.easeInOut }, '+=0.5')
          //     .staggerTo([$soleil2p1, $soleil2p2, $soleil2p3, $soleil2p4], 0.8, { scale: 1, ease: Bounce.easeOut }, 0.150)
          //     .to($soleil2, 0.8, { x: '0', y: '0', ease: Power4.easeInOut })
          //     .staggerTo([$uvp1, $uvp2, $uvp3, $uvp4, $uvp5, $uvp6, $uvp7, $uvp8, $uvp9, $uvp10], 0.350, { autoAlpha: 0.3, ease: Power4.easeInOut, repeat: 5, yoyo: true }, 0.2)
          //     .to($bourgeon1, 0.1, { fill: '#B224A6', ease: Power4.easeInOut, repeat: 6, yoyo: true }, '-=1.75')
          //     //text in
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 1, ease: Power4.easeInOut })
          //     //text out
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 0, ease: Power4.easeInOut }, '+=4.0')
          //     //text update
          //     .set($text, { y: '-=20px', text: "Il sera transmis aux cellules de la branche qui naîtra du bourgeon." })
          //     .to($bourgeon1, 0.5, { autoAlpha: 0, scale: 0, ease: Power4.easeInOut })
          //     .to($branche1a, 0.8, { scale: 1, ease: Power4.easeInOut }, '-=0.75')
          //     .to($branche1b, 0.8, { scale: 1, ease: Power4.easeInOut }, '+=0.5')
          //     //text in
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 1, ease: Power4.easeInOut })
          //     //text out
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 0, ease: Power4.easeInOut }, '+=4.0')
          //     //text update
          //     .set($text, { y: '-=20px', text: "Dans un 2ème temps, une nouvelle mutation se produit dans un autre bourgeon. La cellule souche produit alors une branche re-mutée." })
          //     .to($bourgeon2, 1.2, { scale: 1, ease: Bounce.easeOut })
          //     .staggerTo([$uvp1, $uvp2, $uvp3, $uvp4, $uvp5, $uvp6, $uvp7, $uvp8, $uvp9, $uvp10], 0.350, { autoAlpha: 0.3, ease: Power4.easeInOut, repeat: 5, yoyo: true }, 0.2)
          //     .to($bourgeon2, 0.1, { fill: '#5c82ff', ease: Power4.easeInOut, repeat: 6, yoyo: true }, '-=1.75')
          //     //text in
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 1, ease: Power4.easeInOut })
          //     //text out
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 0, ease: Power4.easeInOut }, '+=4.0')
          //     //text update
          //     .set($text, { y: '-=20px', text: "Au final, on peut s'attendre à trouver des branches très différentes les unes des autres au fil du temps." })
          //     .to($bourgeon2, 0.5, { autoAlpha: 0, scale: 0, ease: Power4.easeInOut })
          //     .to($branche2a, 0.8, { scale: 1, ease: Power4.easeInOut }, '-=0.75')
          //     .to($branche2b, 0.8, { scale: 1, ease: Power4.easeInOut }, '+=0.5')
          //     .to($branche1c, 0.8, { scale: 1, ease: Power4.easeInOut }, '-=0.5')
          //     .to($branche1d, 0.8, { scale: 1, ease: Power4.easeInOut }, '-=1.0')
          //     .staggerTo([$branche3, $branche4, $branche5, $branche6], 0.8, { scale: 1, ease: Power4.easeInOut }, 0.2, '+=2.0')
          //     //text in
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 1, ease: Power4.easeInOut })
          //     //text out
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 0, ease: Power4.easeInOut }, '+=4.0')
          //     //text update
          //     .set($text, { y: '-=20px', text: "Ce n'est cependant pas le cas..." })
          //     //text in
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 1, ease: Power4.easeInOut })
          //     //text out
          //     .to($text, 0.8, { y: '+=10px', autoAlpha: 0, ease: Power4.easeInOut }, '+=4.0')
          //     .staggerTo([$branche3, $branche4, $branche5, $branche6], 0.8, { fill: '#804c19', ease: Power4.easeInOut }, 0);

          //   return zoomIntoTreeTl;
          // }

          // function init() {
          //   mainTl
          //     .add(clearStage())
          //     .add(zoomIntoTree());
          // }
          // init();

          // $("#mainTlSlider").slider({
          //   range: false,
          //   min: 0,
          //   max: 1,
          //   step: .001,
          //   slide: function (event, ui) {
          //     mainTl.progress(ui.value).pause();
          //   },
          //   stop: function () {
          //     mainTl.play();
          //   }
          // });

          // function updateSlider() {
          //   $("#mainTlSlider").slider("value", mainTl.progress());
          // }

          // //Timeline spécifique pour l'overlay avec bouton play
          // var overlayTl = new TimelineMax({ paused: true }),
          //   $overlay = $('#overlay'),
          //   $playB = $('#playb');

          // $($overlay).add($playB).click(function (e) {
          //   overlayTl
          //     .set($sceneControls, { autoAlpha: 0 })
          //     .set($playB, { transformOrigin: 'center center' })
          //     .to($playB, 0.8, { scale: 0, ease: Power4.easeInOut })
          //     .to($overlay, 0.8, { autoAlpha: 0 })
          //     .to($sceneControls, 0.8, { autoAlpha: 1 }, '-=1.6');
          //   overlayTl.play();
          //   mainTl.play();
          // }); 

});
