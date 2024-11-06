$(window).on('load', function() {
    let deviceBreakpoint = 768;

    // BodyMovin Animations Vanilla JS
    const loop = () => {
        let loop = {
            container: document.getElementById('super-hand-loop'),
            path: 'https://raw.githubusercontent.com/Mayabytes-LLP/mayabytes-hands/main/static/super-hand-loop.json',
            renderer: 'svg',
            loop: !0,
            autoplay: !0,
            name: 'Hand Animation Loop'
        };
        bodymovin.loadAnimation(loop).setSpeed(0.80);
        setTimeout(function() {
            document.getElementById('super-hand-reveal').style.opacity = '0';
        }, 500);
    }

    let reveal = {
        container: document.getElementById('super-hand-reveal'),
        path: 'https://raw.githubusercontent.com/Mayabytes-LLP/mayabytes-hands/main/static/super-hand-reveal.json',
        renderer: 'svg',
        loop: !1,
        autoplay: false,
        name: 'Hand Animation Reveal'
    }

    let superHandAnimation = bodymovin.loadAnimation(reveal);
    superHandAnimation.addEventListener('complete', loop);

    let hover = {
        container: document.getElementById('super-hand-hover'),
        path: 'https://raw.githubusercontent.com/Mayabytes-LLP/mayabytes-hands/main/static/super-hand-hover.json',
        renderer: 'svg',
        loop: !0,
        autoplay: false,
        name: 'Hand Animation Hover'
    };

    let superHandFloating = bodymovin.loadAnimation(hover);
    superHandFloating.setSpeed(1.5);


    // Menu Anumation
    const menuAnimation = new TimelineMax();
    menuAnimation
        .to('menu', 0.75, { right: '0', ease: Expo.easeInOut }, 0.1, '0')
        .to('#menu-close', 0.75, { rotation: '-180', transformOrigin: 'center', ease: Linear.easeNone }, 0.1, '0')
        .staggerFromTo('#main-nav tag, #main-nav ul li, #contact-info tag, #contact-info p, #contact-info span', 0.5, { opacity: '0', marginLeft: '-10px' }, { opacity: '1', marginLeft: '0px', ease: Expo.easeInOut }, 0.075, '0.3')
        .staggerFromTo('#social-nav ul li', 0.5, { opacity: '0', marginLeft: '-10px' }, { opacity: '1', marginLeft: '0px', ease: Expo.easeInOut }, 0.075, '0.3')
        .stop();

    // Menu Interactions
    $('#menu-open').on('click', function(){
        menuAnimation.play();
    });

    $('#menu-close').on('click', function(){
        menuAnimation.reverse();
    });


    // Slide Animations
    let activeSlide = 0;
    let oldSlide = 0;
    let slideAnimation;
    const slides = document.querySelectorAll('article');
    const homeBgColors = ['#FFFFFF', '#FE663F', '#7140FE', '#F8CB3E'];
    let homeBgColor = '#FFFFFF';
    const projectBgColors = ['#FE663F', '#31D1BE', '#7265E3', '#CB9274', '#FF7F56'];

    const slideAnim = (e) => {
        // If the container is animating stop the wheel from working
        if (slideAnimation && slideAnimation.isActive()) {
            return;
        }
        // Temp var to check if we're at the beginning or end
        oldSlide = activeSlide;
        // Which dircection did we scroll the mousewheel in
        activeSlide = e.deltaY > 0 ? (activeSlide += 1) : (activeSlide -= 1);
        // Are we at the first slide?
        activeSlide = activeSlide < 0 ? 0 : activeSlide;
        // Are we at the last slide?
        activeSlide = activeSlide > slides.length - 1 ? slides.length - 1 : activeSlide;
        // If we are at the first or last slide animate nothing
        if (oldSlide === activeSlide) {
            return;
        }
        // Else, we can animate the container to the new position
        if (activeSlide !== 1) {
            homeBgColor = homeBgColors[activeSlide];
        } else {
            const currentProject = $('submenu a.active').data('project');
            homeBgColor = projectBgColors[currentProject - 1];
        }

        slideAnimation = new TimelineMax();
        slideAnimation
            .to('section', 1, { yPercent: -100 / slides.length * activeSlide, ease: Power4.easeIn }, 0, '0')
            .to('body, .project-images span', 1, { backgroundColor: homeBgColor, ease: Power4.easeIn }, 0, '<')
            .to('.st0, .st1', 1, { fill: homeBgColor, ease: Power4.easeIn }, 0.01);
    }

    // Listen for mousewheel scroll
    if (screen.width > deviceBreakpoint) {
        window.addEventListener('wheel', slideAnim);
    }


    // Touch Animations
    let direction = null;
    let xDown = null;
    let yDown = null;

    const getTouches = (e) => {
        return e.touches || // browser API
            e.originalEvent.touches; // jQuery
    }

    const handleTouchStart = (e) => {
        const firstTouch = getTouches(e)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    const handleTouchMove = (e) => {
        if (!xDown || !yDown) {
            return;
        }

        let xUp = e.touches[0].clientX;
        let yUp = e.touches[0].clientY;

        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;

        if (Math.abs(yDiff) > Math.abs(xDiff)) {
            if (yDiff > 0) {
                direction = 'down';
            } else {
                direction = 'up';
            }
        }
        xDown = null;
        yDown = null;

        if (slideAnimation && slideAnimation.isActive()) {
            return;
        }
        oldSlide = activeSlide;
        activeSlide = direction == 'down' ? (activeSlide += 1) : (activeSlide -= 1);
        activeSlide = activeSlide < 0 ? 0 : activeSlide;
        activeSlide = activeSlide > slides.length - 1 ? slides.length - 1 : activeSlide;
        if (oldSlide === activeSlide) {
            return;
        }
        if (activeSlide !== 1) {
            homeBgColor = homeBgColors[activeSlide];
        } else {
            const currentProject = $('submenu a.active').data('project');
            homeBgColor = projectBgColors[currentProject - 1];
        }

        slideAnimation = new TimelineMax();
        slideAnimation
            .to('section', 1, { yPercent: -100 / slides.length * activeSlide, ease: Power4.easeIn }, 0, '0')
            .to('body, .project-images span', 1, { backgroundColor: homeBgColor, ease: Power4.easeIn }, 0, '<')
            .to('.st0, .st1', 1, { fill: homeBgColor, ease: Power4.easeIn }, 0, '<');

        console.log(activeSlide);
    };

    // Listen for touch events
    if (screen.width > deviceBreakpoint) {
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
    }

    $(window).scroll(function(){
        if (screen.width <= deviceBreakpoint) {
            lastKnownScrollPosition = $(window).scrollTop();

            if(lastKnownScrollPosition >= 70) {
                // TweenMax.to('header', 0.25, { backgroundColor: '#FFFFFF', padding: '15px 30px', boxShadow: '0px 0px 1px 1px rgb(0, 0, 0, 0.15)', ease: Power4.easeIn });
                $('header').addClass('white');
            } else {
                // TweenMax.to('header', 0.25, { backgroundColor: 'transparent', padding: '30px', boxShadow: 'none', ease: Power4.easeIn });
                $('header').removeClass('white');
            }
            // console.log(lastKnownScrollPosition);
        }
    });

    if (screen.width > deviceBreakpoint) {
        // // Empower Split Texts
        new SplitText('.empower h1', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.empower h1', { type: 'lines', linesClass: 'lineParent' });
        new SplitText('.empower h1 + p', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.empower h1 + p', { type: 'lines', linesClass: 'lineParent' });
        new SplitText('.footnote.left p, .footnote.right p', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.footnote.left p, .footnote.right p', { type: 'lines', linesClass: 'lineParent' });
        // new SplitText('.empower tag', { type: 'lines', charsClass: 'lineParent' });
        // // Project Details Split Texts
        new SplitText('.project-details > div h2', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.project-details > div h2', { type: 'lines', linesClass: 'lineParent' });
        new SplitText('.project-details > div h2 + p', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.project-details > div h2 + p', { type: 'lines', linesClass: 'lineParent' });
        new SplitText('.btn-more', { type: 'chars', charsClass: 'chars' });
        // // Clients Split Texts
        new SplitText('.clients h3', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.clients h3', { type: 'lines', linesClass: 'lineParent' });
        new SplitText('.clients h3 + p', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.clients h3 + p', { type: 'lines', linesClass: 'lineParent' });
        // // Talk Split Texts
        new SplitText('.talk tag', { type: 'lines', linesClass: 'lineParent' });
        new SplitText('.talk tag', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.talk h3', { type: 'lines', linesClass: 'lineChild' });
        new SplitText('.talk h3', { type: 'lines', linesClass: 'lineParent' });
        $('.lineChild').append('<span class="overlay"></span>');

        onComplete: () => {
            splitTextTl.revert();
            childSplit.revert();
          }
    }

    const empowerAnimation = new TimelineMax();
    if (screen.width > deviceBreakpoint) {
        // Empower Animation
        empowerAnimation
            .fromTo('#logo, #menu-open', 2, { y: -150 }, { y: 0, ease: Expo.easeOut }, 0.1, '0')
            // .staggerFromTo('.empower tag .chars', 0.5, { opacity: '0', letterSpacing: '-10px', scale: 0.75 }, { opacity: '1', letterSpacing: '2px', scale: 1, ease: Expo.easeOut }, 0.025, '0.1')
            .fromTo('.empower tag .lineChild', 0.2, { opacity: 0 }, { opacity: 1, ease: Power4.easeIn }, 0, '0')
            .staggerFromTo('.empower tag', 0.5, { y: 20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('.empower tag .lineChild .overlay', 1, { y: 0 }, { y: -100, ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('h1 .lineChild', 1, { y: 20 }, { y: '-9', ease: Expo.easeOut }, 0.1, '0.2')
            .staggerFromTo('h1 .lineChild .overlay', 1.5, { y: 0 }, { y: '-110', ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('h1 + p .lineChild', 1, { y: 20 }, { y: 0, ease: Expo.easeOut }, 0.1, '0.2')
            .staggerFromTo('h1 + p .lineChild .overlay', 1.5, { y: 0 }, { y: '-110%', ease: Expo.easeOut }, 0.1, '0.2')
            .staggerFromTo('.footnote.left p .lineChild', 1.5, { y: 20 }, { y: 0, ease: Expo.easeOut }, 0.1, '0.1')
            .staggerFromTo('.footnote.left p .lineChild .overlay', 1.5, { y: 0 }, { y: '-110%', ease: Expo.easeOut }, 0.1, '0.1')
            .staggerFromTo('.footnote.right p .lineChild', 1.5, { y: 20 }, { y: 0, ease: Expo.easeOut }, 0.1, '0.1')
            .staggerFromTo('.footnote.right p .lineChild .overlay', 1.5, { y: 0 }, { y: '-110%', ease: Expo.easeOut }, 0.1, '0.1')
            .fromTo('.underline span', 4.5, { width: '0%' }, { width: '100%', ease: Power4.easeIn }, 3, '+=0')
            .fromTo('.empower .lets-talk-svg #textcircle, .text-button', 0.33, { scale: 0, transformOrigin: 'center' }, { scale: 1, transformOrigin: 'center', ease: Linear.easeNone }, 0, '<')
            .staggerTo('.empower .lets-talk-svg .rotating-text tspan', 0.1, { opacity: 1, ease: Sine.easeOut }, 0.025, '-=7')
            .to('.empower .lets-talk-svg .rotating-text', 15, { rotation: '-360', transformOrigin: 'center', ease: Linear.easeNone, repeat: -1 }, 1.75, '+=0')
            .add(function() { superHandAnimation.play() }, '-=16').stop();

        // Super Hand Animation
        superHandAnimation.addEventListener('DOMLoaded', (event) => {
            TweenMax.to('main', 0.1, { opacity: '1', ease: Power4.easeIn });
            empowerAnimation.play();

            // $("#status").fadeOut();
            // $("#preloader").delay(1000).fadeOut("slow");

        });
    }

    let projectSlideImageAnimation = new TimelineMax();
    let projectSlideTextAnimation = new TimelineMax();

    if (screen.width > deviceBreakpoint) {
        // Project Animations

        // Snap Animation
        const snapAnimation = new TimelineMax();
        const snaps = $('svg[id^="snap-"]').length;
        for (let i = 1; i <= snaps; i++) {
            snapAnimation
                .to('#snap-' + i, 0.047, { display: 'block' })
                .to('#snap-' + i, 0, { display: 'none' })
        }
        snapAnimation
            .to('#snap-1', 0, { display: 'block' })
        snapAnimation.stop();

        $('submenu a').on('click', function(e) {
            if (snapAnimation.isActive()) {
                e.preventDefault(); // this will also stop <a> tag links
                e.stopImmediatePropagation(); // this will stop event bubbling
                return false;
            }

            if ($(this).hasClass('active')) {
                return false;
            } else {
                $('submenu a, .project img, .parallax img, .project-details div').removeClass('active');
                $(this).addClass('active');
                let project = $(this).data('project');
                $('.project img[data-project=' + project + '], .parallax img[data-project=' + project + '], .project-details div[data-project=' + project + ']').addClass('active');
                TweenMax.to('.st0, .st1', 1, { fill: projectBgColors[project - 1], ease: Power4.easeIn });
                TweenMax.to('body, .project-images span, .project-details .overlay', 1, { backgroundColor: projectBgColors[project - 1], ease: Power4.easeIn });

                snapAnimation.play(0);

                let projectImageAnimation = new TimelineMax();
                projectImageAnimation
                    .fromTo('.project', 0.5, { opacity: 0 }, { opacity: 1, ease: Power4.easeIn }, 0, '0')
                    .fromTo('.project', 1.75, { y: '120px' }, { y: '0px' }, 0, '<')
                    .fromTo('.project-images span', 0.5, { y: '10%' }, { y: '-100%', ease: Power4.easeIn }, 0.4, '<')
                    .fromTo('.parallax img.active', 0.6, { opacity: 0 }, { opacity: 1, ease: Linear.easeNone }, 1, '<')
                    .fromTo('.parallax img.active', 1, { y: 40 }, { y: 0, ease: Linear.easeNone }, 0.75, '<')
                    .stop();
                projectImageAnimation.play(0);

                let projectTextAnimation = new TimelineMax();
                projectTextAnimation
                    .fromTo('.project-details h2 .lineChild, .project-details h2 + p .lineChild', 0.5, { opacity: 0 }, { opacity: 1, ease: Power4.easeIn }, 0, '0')
                    .staggerFromTo('.project-details div.active h2 .lineChild', 0.5, { y: -20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
                    .staggerFromTo('.project-details div.active h2 .lineChild .overlay', 1.5, { y: 0 }, { y: 120, ease: Expo.easeOut }, 0.1, '<')
                    .staggerFromTo('.project-details div.active h2 + p .lineChild', 1, { y: -20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
                    .staggerFromTo('.project-details div.active h2 + p .lineChild .overlay', 1.5, { y: 0 }, { y: 120, ease: Expo.easeOut }, 0.1, '<')
                    .stop();
                projectTextAnimation.play(0);
            }
        });
    }

    // Projects Slider
    if (screen.width <= deviceBreakpoint) {
        $(".project").slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            asNavFor: '.project-details',
            centerMode: false,

        });

        $(".project-details").slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            asNavFor: '.project',
            centerMode: false,
        });
    }

    const clientsAnimation = new TimelineMax();
    if (screen.width > deviceBreakpoint) {
        // Clients Animation
        clientsAnimation
            .fromTo('.clients h3 .lineChild, .clients h3 + p .lineChild', 0.2, { opacity: 0 }, { opacity: 1, ease: Power4.easeIn }, 0, '0')
            .staggerFromTo('.clients h3 .lineChild', 0.5, { y: 20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('.clients h3 .lineChild .overlay', 1.5, { y: 0 }, { y: -100, ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('.clients h3 + p .lineChild', 1, { y: 20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('.clients h3 + p .lineChild .overlay', 1.5, { y: 0 }, { y: -100, ease: Expo.easeOut }, 0.1, '<')
            .stop();
    }

     // Clients Slider
    $(".clients-slider").slick({
        infinite: !1,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: "<div class='slick-prev-custom slick-nav-arrow'><img src='https://mayabytes.com/wp-content/themes/mayabytes/assets/images/chevron-right-solid.svg'></div>",
        nextArrow: "<div class='slick-next-custom slick-nav-arrow'><img src='https://mayabytes.com/wp-content/themes/mayabytes/assets/images/chevron-right-solid.svg'></div>",
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            }
        }, ],
    });

    // View More
    $('.btn-more').on({
        mouseenter: function() {
            // TweenMax.to('.btn-more span', 0.25, { width: '100%', ease: Power4.easeIn });
        },
        mouseleave: function() {
            // TweenMax.to('.btn-more span', 0.25, { width: '4.3vw', ease: Power4.easeIn });
        }
    });

    const talkAnimation = new TimelineMax();
    const letsTalk = new TimelineMax();
    const letsTalkFallback = new TimelineMax();
    const letsTalkEmpowerFallback = new TimelineMax();
    if (screen.width > deviceBreakpoint) {
        // Talk Animation
        talkAnimation
            .fromTo('.talk h3 .lineChild, .talk tag .lineChild', 0.2, { opacity: 0 }, { opacity: 1, ease: Power4.easeIn }, 0, '0')
            .staggerFromTo('.talk tag', 0.5, { y: 20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('.talk tag .lineChild .overlay', 1, { y: 0 }, { y: -100, ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('.talk h3 .lineChild', 1, { y: 20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
            .staggerFromTo('.talk h3 .lineChild .overlay', 1.5, { y: 0 }, { y: -100, ease: Expo.easeOut }, 0.1, '<')
            .stop();

        // Let's Talk Animation
        letsTalk
            .fromTo('.talk .lets-talk-svg #textcircle-two, .text-button', 0.33, { scale: 0, transformOrigin: 'center' }, { scale: 1, transformOrigin: 'center', ease: Linear.easeNone }, 0, '0')
            .staggerTo('.talk .lets-talk-svg .rotating-text tspan', 0.1, { opacity: 1, ease: Sine.easeOut }, 0.025, '+=0.33')
            .to('.talk .lets-talk-svg .rotating-text', 15, { rotation: '-360', transformOrigin: 'center', ease: Linear.easeNone, repeat: -1 }, 1.75, '+=2').stop();
    }
    
        // Let's Talk Animation
        letsTalkEmpowerFallback
            .fromTo('.empower .lets-talk-fallback', 0.33, { scale: 0, transformOrigin: 'center' }, { scale: 1, transformOrigin: 'center', ease: Linear.easeNone }, 0, '0')
            .fromTo('.empower .lets-talk-fallback span', 0.33, { opacity: 0 }, { opacity: 1, ease: Linear.easeNone }, 0.33, '0.33')
            .to('.empower .lets-talk-fallback span', 15, { rotation: '-360', transformOrigin: 'center', ease: Linear.easeNone, repeat: -1 }, 0.66, '+=2').stop();
        letsTalkFallback
            .fromTo('.talk .lets-talk-fallback', 0.33, { scale: 0, transformOrigin: 'center' }, { scale: 1, transformOrigin: 'center', ease: Linear.easeNone }, 0, '0')
            .fromTo('.talk .lets-talk-fallback span', 0.33, { opacity: 0 }, { opacity: 1, ease: Linear.easeNone }, 0.33, '0.33')
            .to('.talk .lets-talk-fallback span', 15, { rotation: '-360', transformOrigin: 'center', ease: Linear.easeNone, repeat: -1 }, 0.66, '+=2').stop();
 


    // Scroll Magic Scenes
    const controller = new ScrollMagic.Controller();

    const empowerContainer = new ScrollMagic.Scene({
            triggerElement: '.empower',
            triggerHook: 0.5,
            duration: '100%',
        })
        .setClassToggle('.empower', 'in-view')
        .addTo(controller)
        .on('enter', function(event) {
            if (screen.width <= deviceBreakpoint) {
                TweenMax.to('body, .project-images span, header.white', 0.5, { backgroundColor: homeBgColors[0], ease: Power4.easeIn });
            }

            if (screen.width > deviceBreakpoint) {
                empowerAnimation.play();
            }

            letsTalkEmpowerFallback.play();
        })
        .on('leave', function(event) {
            if (screen.width > deviceBreakpoint) {
                empowerAnimation.pause();
            }
            
                letsTalkEmpowerFallback.pause();
            
        });
    // empowerContainer.addIndicators({ name: 'empower scene', colorEnd: '#FFFFFF' });

    const brandingContainer = new ScrollMagic.Scene({
            triggerElement: '.branding',
            triggerHook: 0.5,
            duration: '100%',
        })
        .setClassToggle('.branding', 'in-view')
        .addTo(controller)
        .on('enter', function(event) {
            if (screen.width <= deviceBreakpoint) {
                TweenMax.to('body, .project-images span, header.white', 0.5, { backgroundColor: homeBgColors[1], ease: Power4.easeIn });
            }
            if (screen.width > deviceBreakpoint) {
                TweenMax.to('.project-images span', 0.1, { opacity: 1, ease: Power4.easeIn });
                projectSlideImageAnimation
                    .fromTo('.project', 0, { opacity: 0 }, { opacity: 1, ease: Power4.easeIn }, 0, '0')
                    .fromTo('.project', 1.75, { y: '120px' }, { y: '0px', ease: Expo.easeOut }, 0, '<')
                    .fromTo('.snap', 1.25, { y: '50px' }, { y: 0, ease: Expo.easeOut }, 0.2, '<')
                    .fromTo('.project-images span', 0.5, { y: '10%' }, { y: '-100%', ease: Power4.easeIn }, 0, '<')
                    .fromTo('.parallax img', 0.6, { opacity: 0 }, { opacity: 1, ease: Linear.easeNone }, 1, '<')
                    .fromTo('.parallax img', 1, { y: 40 }, { y: 0, ease: Linear.easeNone }, 0.75, '<')
                    .stop();

                projectSlideTextAnimation
                    .fromTo('.project-details h2 .lineChild, .project-details h2 + p .lineChild', 0.5, { opacity: 0 }, { opacity: 1, ease: Power4.easeIn }, 0, '0')
                    .staggerFromTo('.project-details div.active h2 .lineChild', 0.5, { y: -20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
                    .staggerFromTo('.project-details div.active h2 .lineChild .overlay', 1.5, { y: 0 }, { y: 120, ease: Expo.easeOut }, 0.1, '<')
                    .staggerFromTo('.project-details div.active h2 + p .lineChild', 1, { y: -20 }, { y: 0, ease: Expo.easeOut }, 0.1, '<')
                    .staggerFromTo('.project-details div.active h2 + p .lineChild .overlay', 1.5, { y: 0 }, { y: 120, ease: Expo.easeOut }, 0.1, '<')
                    .fromTo('.project-details div.active .btn-more', 0.5, { opacity: 0, x: -20 }, { opacity: 1, x: 0, ease: Linear.easeNone }, 1, '+=0')
                    .staggerFromTo('.project-details div.active .btn-more .chars', 0.25, { opacity: 0 }, { opacity: 1, ease: Expo.easeOut }, 0.05, '-=1')
                    .stop();
                projectSlideImageAnimation.play(0);
                projectSlideTextAnimation.play(0);
            }
        })
        .on('leave', function(event) {
            if (screen.width > deviceBreakpoint) {
                TweenMax.to('.project-images span', 0.5, { opacity: 0, ease: Power4.easeIn });
                projectSlideImageAnimation.reverse(0.1);
                projectSlideTextAnimation.reverse(0.1);
            }
        });
    // brandingContainer.addIndicators({ name: 'branding scene', colorEnd: '#FFFFFF' });

    const clientsContainer = new ScrollMagic.Scene({
            triggerElement: '.clients',
            triggerHook: 0.5,
            duration: '100%',
        })
        .setClassToggle('.clients', 'in-view')
        .addTo(controller)
        .on('enter', function(event) {
            if (screen.width <= deviceBreakpoint) {
                TweenMax.to('body, .project-images span, header.white', 0.5, { backgroundColor: homeBgColors[2], ease: Power4.easeIn });
            }
            if (screen.width > deviceBreakpoint) {
                TweenMax.to('#logo svg path', 0.15, { fill: '#FFFFFF', ease: Power4.easeIn });
                TweenMax.to('#menu-open span', 0.15, { backgroundColor: '#FFFFFF', ease: Power4.easeIn });
                clientsAnimation.play(0);
                superHandFloating.play();
            }

            $(".ribbon_badge").addClass("active");
        })
        .on('leave', function(event) {
            if (screen.width > deviceBreakpoint) {
                TweenMax.to('#logo svg path', 0.15, { fill: '#000000', ease: Power4.easeIn });
                TweenMax.to('#menu-open span', 0.15, { backgroundColor: '#000000', ease: Power4.easeIn });
                clientsAnimation.reverse(0.1);
                superHandFloating.pause();
            }

            $(".ribbon_badge").removeClass("active");
        });
    // clientsContainer.addIndicators({ name: 'clients scene', colorEnd: '#FFFFFF' });

    const talkContainer = new ScrollMagic.Scene({
            triggerElement: '.talk',
            triggerHook: 0.5,
            duration: '100%',
        })
        .setClassToggle('.talk', 'in-view')
        .addTo(controller)
        .on('enter', function(event) {
            if (screen.width <= deviceBreakpoint) {
                TweenMax.to('body, .project-images span, header.white', 0.5, { backgroundColor: homeBgColors[3], ease: Power4.easeIn });
                letsTalkFallback.play();
            }
            if (screen.width > deviceBreakpoint) {
                talkAnimation.play(0);
                letsTalk.play();
                letsTalkFallback.play();
                
                setTimeout(function() { 
                    $(".hand").addClass("end");
                }, 600);
                
            }
        })
        .on('leave', function(event) {
            if (screen.width > deviceBreakpoint) {
                talkAnimation.reverse(0.1);
                letsTalk.pause();
                letsTalkFallback.pause();
                $(".hand").removeClass("end");
            }
            if (screen.width <= deviceBreakpoint) {
                letsTalkFallback.pause();
            }
        });
    // talkContainer.addIndicators({ name: 'talk scene', colorEnd: '#FFFFFF' });
if (screen.width > deviceBreakpoint) {
		superHandAnimation.addEventListener('DOMLoaded', (event) => {
			var counting = setInterval(function () {
			var loader = document.getElementById("percentage");
			var currval = parseInt(loader.innerHTML);
			var Width = 99 - currval;
			var loadscreen = document.getElementById("loader-progress");
			loader.innerHTML = ++currval;

			if (currval > 30){
				loader.innerHTML = 30;

				if(window.jQuery) {

					//console.log('jquery loaded');

					loader.innerHTML = 62;
					if(document.readyState == "interactive") {

						loader.innerHTML = 62;

					}
					if(document.readyState == "complete") {
						//console.log('fully loaded!');

						clearInterval(counting);
						loader.innerHTML = 100;
						jQuery("body").toggleClass('page-loaded');
						setTimeout(function() {
							jQuery('nav').css('visibility','visible')
						}, 880);

					}

				}

			} 


				loadscreen.style.transition = "0.15s";
				loadscreen.style.width = Width + "%";
			}, 20);
		});
	}
	
	if (screen.width <= deviceBreakpoint) {
		var counting = setInterval(function () {
			var loader = document.getElementById("percentage");
			var currval = parseInt(loader.innerHTML);
			var Width = 99 - currval;
			var loadscreen = document.getElementById("loader-progress");
			loader.innerHTML = ++currval;

			if (currval > 30){
				loader.innerHTML = 30;

				if(window.jQuery) {

					//console.log('jquery loaded');

					loader.innerHTML = 62;
					if(document.readyState == "interactive") {

						loader.innerHTML = 62;

					}
					if(document.readyState == "complete") {
						//console.log('fully loaded!');

						clearInterval(counting);
						loader.innerHTML = 100;
						jQuery("body").toggleClass('page-loaded');
						setTimeout(function() {
							jQuery('nav').css('visibility','visible')
						}, 880);

					}

				}

			} 


				loadscreen.style.transition = "0.15s";
				loadscreen.style.width = Width + "%";
		}, 20);
	}
	
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
  $('.branding .project-details').addClass('ios');
}
});

// $(document).ready(function() {


// });