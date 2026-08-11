(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

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

  document.body.classList.add('intro-open');

  /* ---------------------------------------------------------
     LOADER — intentionally short. Do NOT wait for canplaythrough.
     This prevents the opening from feeling frozen while the MP4
     continues buffering in the background.
  --------------------------------------------------------- */
  let progress = 0;
  const loaderTimer = setInterval(() => {
    progress = Math.min(progress + 8, 92);
    loaderFill.style.width = progress + '%';
  }, 70);

  function finishLoader() {
    clearInterval(loaderTimer);
    loaderFill.style.width = '100%';
    setTimeout(() => loader.classList.add('is-hidden'), 160);
  }
  introVideo.addEventListener('loadedmetadata', () => setTimeout(finishLoader, 120), { once: true });
  setTimeout(finishLoader, 1500);

  /* ---------------------------------------------------------
     PAGE TRANSITION
     A white/ice flash is layered into the transition so the
     00:18 camera move feels like entering the cockpit.
  --------------------------------------------------------- */
  function switchPage(target) {
    transition.classList.remove('run');
    void transition.offsetWidth;
    transition.classList.add('run');

    setTimeout(() => {
      const openingPortfolio = target === 'portfolio';
      intro.classList.toggle('is-active', !openingPortfolio);
      portfolio.classList.toggle('is-active', openingPortfolio);
      document.body.classList.toggle('intro-open', !openingPortfolio);
      document.body.classList.toggle('portfolio-open', openingPortfolio);

      if (openingPortfolio) {
        introVideo.pause();
        window.scrollTo(0, 0);
        setActiveSection('profile', false);
      } else {
        window.scrollTo(0, 0);
        introVideo.currentTime = 0;
        introVideo.dataset.transitioned = '';
        introVideo.play().catch(() => {});
      }
    }, 480);
  }

  enterBtn.addEventListener('click', () => switchPage('portfolio'));
  backBtn.addEventListener('click', () => switchPage('intro'));

  /* ---------------------------------------------------------
     INTRO VIDEO — NORMAL PLAYBACK, NOT SCROLL SCRUBBING.
     The portfolio opens automatically at exactly 18 seconds.
  --------------------------------------------------------- */
const introVideo = document.getElementById("introVideo");
const introPage = document.getElementById("introPage");
const portfolioPage = document.getElementById("portfolioPage");
const transition = document.getElementById("transition");

let enteredPortfolio = false;

function enterPortfolio() {

    if (enteredPortfolio) return;

    enteredPortfolio = true;

    // Start cinematic flash
    transition.classList.add("is-active");

    setTimeout(() => {

        introPage.classList.remove("is-active");

        portfolioPage.classList.add("is-active");

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    }, 350);

    setTimeout(() => {

        transition.classList.remove("is-active");

    }, 900);
}


/* Automatically enter at exactly 18 seconds */

introVideo.addEventListener("timeupdate", () => {

    if (
        introVideo.currentTime >= 18 &&
        !enteredPortfolio
    ) {

        enterPortfolio();

    }

});


/* Manual button */

const enterButton =
    document.getElementById("enterPortfolio");

if (enterButton) {

    enterButton.addEventListener(
        "click",
        enterPortfolio
    );

}

  /* ---------------------------------------------------------
     PORTFOLIO = APP-LIKE PAGES, NOT ONE LONG CV SCROLL.
     Each top nav button replaces the visible CV station.
  --------------------------------------------------------- */
  function setActiveSection(id, updateUrl = true) {
    const target = document.getElementById(id);
    if (!target) return;

    sections.forEach(section => section.classList.toggle('is-active', section === target));
    navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));

    stationNo.textContent = target.dataset.station;
    stationName.textContent = target.dataset.label;

    const wheel = $('.wheel-slot');
    wheel.classList.remove('station-1','station-2','station-3','station-4','station-5','station-6');
    wheel.classList.add(`station-${target.dataset.station}`);

    if (updateUrl) history.replaceState({ page: 'portfolio', panel: id }, '', `#portfolio/${id}`);
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => setActiveSection(btn.dataset.target));
  });

  /* Steering wheel upload / drag-drop placeholder */
  function showWheel(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    wheelImage.src = url;
    wheelImage.hidden = false;
    wheelPlaceholder.style.display = 'none';
  }
  wheelInput.addEventListener('change', e => showWheel(e.target.files[0]));
  wheelSlot.addEventListener('dragover', e => { e.preventDefault(); wheelSlot.classList.add('dragging'); });
  wheelSlot.addEventListener('dragleave', () => wheelSlot.classList.remove('dragging'));
  wheelSlot.addEventListener('drop', e => {
    e.preventDefault();
    wheelSlot.classList.remove('dragging');
    showWheel(e.dataTransfer.files[0]);
  });

  window.addEventListener('popstate', () => {
    const hash = location.hash;
    if (hash.startsWith('#portfolio/')) {
      const id = hash.split('/')[1];
      if (!portfolio.classList.contains('is-active')) switchPage('portfolio');
      setActiveSection(CV_SECTION_IDS.includes(id) ? id : 'profile', false);
    } else {
      switchPage('intro');
    }
  });

  const CV_SECTION_IDS = sections.map(section => section.id);
  const initialPanel = location.hash.startsWith('#portfolio/') ? location.hash.split('/')[1] : 'profile';
  setActiveSection(CV_SECTION_IDS.includes(initialPanel) ? initialPanel : 'profile', false);

  window.addEventListener('keydown', e => {
    if (e.key === 'Enter' && intro.classList.contains('is-active')) switchPage('portfolio');
    if (e.key === 'Escape' && portfolio.classList.contains('is-active')) switchPage('intro');
  });
})();
