(() => {

    /* =====================================================
       DOM HELPERS
       ===================================================== */

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];


    /* =====================================================
       MAIN ELEMENTS
       ===================================================== */

    const loader = $('#loader');
    const loaderFill = $('#loaderFill');

    const intro = $('#introPage');
    const portfolio = $('#portfolioPage');

    const transition = $('#transition');

    const introVideo = $('#introVideo');

    const enterBtn = $('#enterPortfolio');
    const backBtn = $('#backToIntro');

    const navButtons = $$('#sectionNav button');
    const sections = $$('.cv-section');

    const stationNo = $('#stationNo');
    const stationName = $('#stationName');

    const wheelInput = $('#wheelInput');
    const wheelImage = $('#wheelImage');
    const wheelPlaceholder = $('.wheel-placeholder');
    const wheelSlot = $('#wheelSlot');


    /* =====================================================
       SAFETY CHECK
       ===================================================== */

    console.log('Portfolio JS loaded.');

    if (!intro) console.warn('#introPage not found');
    if (!portfolio) console.warn('#portfolioPage not found');
    if (!introVideo) console.warn('#introVideo not found');
    if (!transition) console.warn('#transition not found');


    /* =====================================================
       BODY STATE
       ===================================================== */

    document.body.classList.add('intro-open');


    /* =====================================================
       LOADER
       ===================================================== */

    let progress = 0;

    const loaderTimer = setInterval(() => {

        progress = Math.min(progress + 8, 92);

        if (loaderFill) {
            loaderFill.style.width = progress + '%';
        }

    }, 70);


    function finishLoader() {

        clearInterval(loaderTimer);

        if (loaderFill) {
            loaderFill.style.width = '100%';
        }

        setTimeout(() => {

            if (loader) {
                loader.classList.add('is-hidden');
            }

        }, 160);

    }


    if (introVideo) {

        introVideo.addEventListener(
            'loadedmetadata',
            () => setTimeout(finishLoader, 120),
            { once: true }
        );

    }

    setTimeout(finishLoader, 1500);


    /* =====================================================
       PORTFOLIO SECTION
       ===================================================== */

    const CV_SECTION_IDS =
        sections.map(section => section.id);


    function setActiveSection(
        id,
        updateUrl = true
    ) {

        const target =
            document.getElementById(id);

        if (!target) return;


        /* Show selected CV section */

        sections.forEach(section => {

            section.classList.toggle(
                'is-active',
                section === target
            );

        });


        /* Update navigation */

        navButtons.forEach(button => {

            button.classList.toggle(
                'active',
                button.dataset.target === id
            );

        });


        /* Update station information */

        if (stationNo) {

            stationNo.textContent =
                target.dataset.station || '';

        }

        if (stationName) {

            stationName.textContent =
                target.dataset.label || '';

        }


        /* Move steering wheel position */

        const wheel =
            document.querySelector('.wheel-slot');

        if (wheel) {

            wheel.classList.remove(
                'station-1',
                'station-2',
                'station-3',
                'station-4',
                'station-5',
                'station-6'
            );

            if (target.dataset.station) {

                wheel.classList.add(
                    `station-${target.dataset.station}`
                );

            }

        }


        /* Update URL */

        if (updateUrl) {

            history.replaceState(
                {
                    page: 'portfolio',
                    panel: id
                },
                '',
                `#portfolio/${id}`
            );

        }

    }


    /* =====================================================
       NAVIGATION BUTTONS
       ===================================================== */

    navButtons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                setActiveSection(
                    button.dataset.target
                );

            }
        );

    });


    /* =====================================================
       PAGE TRANSITION
       ===================================================== */

    function switchPage(target) {

        if (!intro || !portfolio) return;


        /* Start flash */

        if (transition) {

            transition.classList.remove('run');

            void transition.offsetWidth;

            transition.classList.add('run');

        }


        setTimeout(() => {

            const openingPortfolio =
                target === 'portfolio';


            /* Intro */

            intro.classList.toggle(
                'is-active',
                !openingPortfolio
            );


            /* Portfolio */

            portfolio.classList.toggle(
                'is-active',
                openingPortfolio
            );


            /* Body state */

            document.body.classList.toggle(
                'intro-open',
                !openingPortfolio
            );

            document.body.classList.toggle(
                'portfolio-open',
                openingPortfolio
            );


            if (openingPortfolio) {

                /* Stop video */

                if (introVideo) {
                    introVideo.pause();
                }


                window.scrollTo(0, 0);


                /* Open Profile */

                setActiveSection(
                    'profile',
                    false
                );


            } else {

                /* Reset intro */

                window.scrollTo(0, 0);


                if (introVideo) {

                    introVideo.currentTime = 0;

                    introVideo.dataset.transitioned = '';

                    introVideo.play().catch(() => {});

                }

            }

        }, 480);

    }


    /* =====================================================
       ENTER / BACK BUTTON
       ===================================================== */

    if (enterBtn) {

        enterBtn.addEventListener(
            'click',
            () => switchPage('portfolio')
        );

    }


    if (backBtn) {

        backBtn.addEventListener(
            'click',
            () => switchPage('intro')
        );

    }


    /* =====================================================
       INTRO VIDEO
       NORMAL PLAYBACK
       PORTFOLIO OPENS AT 18 SECONDS
       ===================================================== */

    let enteredPortfolio = false;


    if (introVideo) {

        introVideo.addEventListener(
            'timeupdate',
            () => {

                if (
                    introVideo.currentTime >= 18 &&
                    !enteredPortfolio
                ) {

                    enteredPortfolio = true;

                    switchPage('portfolio');

                }

            }
        );

    }


    /* =====================================================
       STEERING WHEEL UPLOAD
       ===================================================== */

    function showWheel(file) {

        if (!file) return;


        if (!file.type.startsWith('image/')) {

            alert(
                'Please upload an image file.'
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload = event => {

            if (!wheelImage) return;


            wheelImage.src =
                event.target.result;


            wheelImage.hidden = false;


            if (wheelPlaceholder) {

                wheelPlaceholder.style.display =
                    'none';

            }


            if (wheelSlot) {

                wheelSlot.classList.add(
                    'has-wheel'
                );

            }


            /* Save wheel */

            try {

                localStorage.setItem(
                    'minhHangWheel',
                    event.target.result
                );

            } catch (error) {

                console.warn(
                    'Wheel image could not be saved.'
                );

            }

        };


        reader.readAsDataURL(file);

    }


    /* File upload */

    if (wheelInput) {

        wheelInput.addEventListener(
            'change',
            event => {

                showWheel(
                    event.target.files[0]
                );

            }
        );

    }


    /* Drag */

    if (wheelSlot) {

        wheelSlot.addEventListener(
            'dragover',
            event => {

                event.preventDefault();

                wheelSlot.classList.add(
                    'dragging'
                );

            }
        );


        wheelSlot.addEventListener(
            'dragleave',
            () => {

                wheelSlot.classList.remove(
                    'dragging'
                );

            }
        );


        wheelSlot.addEventListener(
            'drop',
            event => {

                event.preventDefault();

                wheelSlot.classList.remove(
                    'dragging'
                );


                showWheel(
                    event.dataTransfer.files[0]
                );

            }
        );

    }


    /* Restore wheel */

    try {

        const savedWheel =
            localStorage.getItem(
                'minhHangWheel'
            );


        if (
            savedWheel &&
            wheelImage
        ) {

            wheelImage.src =
                savedWheel;

            wheelImage.hidden = false;


            if (wheelPlaceholder) {

                wheelPlaceholder.style.display =
                    'none';

            }


            if (wheelSlot) {

                wheelSlot.classList.add(
                    'has-wheel'
                );

            }

        }

    } catch (error) {

        console.warn(
            'Could not restore steering wheel.'
        );

    }


    /* =====================================================
       BROWSER BACK / FORWARD
       ===================================================== */

    window.addEventListener(
        'popstate',
        () => {

            const hash =
                location.hash;


            if (
                hash.startsWith(
                    '#portfolio/'
                )
            ) {

                const id =
                    hash.split('/')[1];


                if (
                    portfolio &&
                    !portfolio.classList.contains(
                        'is-active'
                    )
                ) {

                    switchPage('portfolio');

                }


                setActiveSection(
                    CV_SECTION_IDS.includes(id)
                        ? id
                        : 'profile',
                    false
                );


            } else {

                switchPage('intro');

            }

        }
    );


    /* =====================================================
       INITIAL PAGE
       ===================================================== */

    const initialPanel =
        location.hash.startsWith(
            '#portfolio/'
        )
            ? location.hash.split('/')[1]
            : 'profile';


    setActiveSection(

        CV_SECTION_IDS.includes(
            initialPanel
        )
            ? initialPanel
            : 'profile',

        false

    );


    /* =====================================================
       KEYBOARD
       ===================================================== */

    window.addEventListener(
        'keydown',
        event => {

            if (
                event.key === 'Enter' &&
                intro &&
                intro.classList.contains(
                    'is-active'
                )
            ) {

                switchPage('portfolio');

            }


            if (
                event.key === 'Escape' &&
                portfolio &&
                portfolio.classList.contains(
                    'is-active'
                )
            ) {

                switchPage('intro');

            }

        }
    );


})();
