(function($) {
    $.responsiveSlider = {};

    $.responsiveSlider.version = '0.1';

    var transitions = typeof $("<div>").css({transition: 'all'}).css('transition') == 'string';
        touchEnabled = ('ontouchstart' in document.documentElement);

    $.fn.responsiveSlider = function(options) {
        if (options === undefined) options = {};
        // Setup the carousel
        var maxLi = (options.maxLi === undefined || options.maxLi === 'default') ? 360 : options.maxLi;
            minLi = (options.minLi === undefined || options.minLi === 'default') ? 148 : options.minLi;;
            marginLi = (options.marginLi === undefined || options.marginLi === 'default') ? 4 : options.marginLi;
            marginNav = (options.marginNav === undefined || options.marginNav === 'default') ? 3 : options.marginNav;
            interval = (options.interval === undefined || options.interval ===  'default') ? 0 : options.interval;
            duration = (options.duration === undefined || options.duration ===  'default') ? 600 : options.duration;
            wrap = (options.wrap === undefined || options.wrap ===  'default') ? 'last' : options.wrap;
            sideNav = (options.sideNav === 0) ? 0 : 1;
            bottomNav = (options.bottomNav === 0) ? 0 : 1;

        console.log(maxLi);

        var carouselStage = $('.carousel-stage').jcarousel({
            animation: {
                'duration': duration,
            },
            wrap: wrap, 
            greensock: true,
            transitions: Modernizr.csstransitions ? {
                    transforms:   Modernizr.csstransforms,
                    transforms3d: Modernizr.csstransforms3d,
                    easing:       'ease',
                    duration: duration
                } : false
        });

        var responsive = function() {

            if (sideNav == 0) {
                $('.stage nav').hide();
            }

            if (bottomNav == 0) {
                $('navigation nav').hide();
            }

            var w = $(window).width();
                wc = $('.connected-carousels .carousel-stage').width();
                
            if (w < 481) {
                $('.carousel-stage img').css('width', wc);
                numLi = 1;
            } else {
                //console.log(wc/numLi - marginLi * 2);
                numLi = Math.ceil(wc/maxLi); 
                $('.carousel-stage img').css('width', wc/numLi - marginLi * 2);
                //console.log(marginLi);
            };

            page = Math.ceil($('.carousel-stage li').length/numLi);
            //console.log('page ' + page);

            $('.carousel-stage li').css('margin', marginLi);
        
            carouselStage
                .on('animateend.jcarousel', function(event, carousel) {

                    console.log('first-last');
                    console.log(carouselStage.jcarousel('first').index());
                    console.log(carouselStage.jcarousel('last').index());

                    var stageCurrent = Math.ceil(carouselStage.jcarousel('first').index()/numLi) + 1;
                    $('.navigation li.active').removeClass('active');
                    $('a[href=#'+stageCurrent+']').parent('li').addClass('active');
                });  

            $('.carousel-stage img').css('height', 'auto');


            $('.prev-stage')             
                .on('inactive.jcarouselcontrol', function() {
                    $(this).addClass('inactive');
                })
                .on('active.jcarouselcontrol', function() {
                    $(this).removeClass('inactive');

                })
                .jcarouselControl({
                    target: '-='+numLi
                });
            
            $('.next-stage')
                .on('inactive.jcarouselcontrol', function() {
                    $(this).addClass('inactive');               
                })
                .on('active.jcarouselcontrol', function() {
                    $(this).removeClass('inactive');

                })
                .jcarouselControl({
                    target: '+='+numLi
                });

            $('.prev-navigation')      
                .on('inactive.jcarouselcontrol', function() {
                    $(this).addClass('inactive');               
                })
                .on('active.jcarouselcontrol', function() {
                    $(this).removeClass('inactive');
                })
                .jcarouselControl({
                    target: '-='+numLi
                });  

            $('.next-navigation')
                .on('inactive.jcarouselcontrol', function() {
                    $(this).addClass('inactive');               
                })
                .on('active.jcarouselcontrol', function() {
                    $(this).removeClass('inactive');
                })
                .jcarouselControl({
                    target: '+='+numLi
                });

            $('.jcarousel-pagination').jcarouselPagination({
                'carousel': carouselStage,
                'perPage': numLi,
                'item': function(page, carouselItems) {
                    return '<li><a href="#' + page + '" alt=""></a></li>';
                }                
            });

            $('.carousel-navigation li:first-child').addClass('active');
            $('.carousel-navigation ul').css('width',($(".carousel-navigation li").width()+marginNav*2)*page); 
            $('.carousel-navigation').css('width',($(".carousel-navigation li").width()+marginNav*2)*page + 2*parseInt($('.carousel-navigation ul').css('margin-left')));

            carouselStage.jcarousel('scroll', 0);


        };

        var autoscroll = function() {
            $('.next-stage').click();
        };

        $(window).resize(function(){
            responsive();
        });
        //Fix IE width issue 
        window.resizeTo(window.screen.availWidth,window.screen.availHeight); 

        responsive();
        
        if (interval !== 0) {
            window.setInterval(autoscroll,interval);
        }  

        if( /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
            var next = function(){$('.next-stage').click();};
                prev = function(){$('.prev-stage').click();};

            $$('.connected-carousels')
                .swipeLeft( function(){
                    next();                
                })
                .swipeRight( function(){
                    prev();                
                });
        }

    };
})(jQuery);
