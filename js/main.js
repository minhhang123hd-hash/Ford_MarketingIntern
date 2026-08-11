/* =========================================================================
   MAIN.JS — the scroll engine.

   Three scroll-scrubbed scenes, all driven off one requestAnimationFrame
   loop reading window.scrollY (no scroll-jacking libraries, just sticky
   positioning + rAF, so it stays smooth and works with trackpads,
   mouse wheels and touch alike):

     1. #sceneVideo   — scrubs the Ford reveal video frame-by-frame
     2. #sceneDoor    — splits the screen open like a roof panel
     3. #sceneCockpit — rotates an SVG steering wheel through 5 CV stops
   ========================================================================= */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------- viewport fix
     Mobile browsers resize their chrome as you scroll, which makes 100vh
     jump around. Lock a --vh custom property to the real value instead. */
  function setVH(){
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);

  /* --------------------------------------------------------- build content */
  const windshield = document.getElementById('windshield');
  const dashDots = document.getElementById('dashDots');

  PANELS.forEach((p, i) => {
    const panel = document.createElement('div');
    panel.className = 'cv-panel';
    panel.dataset.index = i;
    panel.innerHTML = `
      <div class="cv-panel__gauge">
        <span class="cv-panel__stop">${p.stop}</span>
        <span class="cv-panel__label">${p.gauge}</span>
      </div>
      <h3 class="cv-panel__title">${p.title}</h3>
      <div class="cv-panel__body">${p.body}</div>
      <div class="cv-panel__stats">
        ${p.stats.map(s => `
          <div>
            <div class="cv-panel__stat-value">${s.value}</div>
            <div class="cv-panel__stat-label">${s.label}</div>
          </div>`).join('')}
      </div>
    `;
    windshield.appendChild(panel);

    const dot = document.createElement('div');
    dot.className = 'dash-dots__dot';
    dashDots.appendChild(dot);
  });

  document.getElementById('chromeName').textContent = CANDIDATE.name;

  document.getElementById('endEyebrow').textContent = END_SCREEN.eyebrow;
  document.getElementById('endHeadline').textContent = END_SCREEN.headline;
  document.getElementById('endBody').textContent = END_SCREEN.body;
  document.getElementById('endCommitment').textContent = END_SCREEN.commitment;
  document.getElementById('endCta').textContent = END_SCREEN.cta + ' ↗';
  document.getElementById('endCta').href = `mailto:${CANDIDATE.email.replace(/[\[\]]/g,'') || 'youremail@example.com'}`;
  document.getElementById('contactPhone').textContent = '☎ ' + CANDIDATE.phone;
  document.getElementById('contactEmail').textContent = '✉ ' + CANDIDATE.email;
  document.getElementById('contactLinkedin').textContent = '↗ ' + CANDIDATE.linkedin;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------- elements */
  const video = document.getElementById('revealVideo');
  const sceneVideo = document.getElementById('sceneVideo');
  const sceneDoor = document.getElementById('sceneDoor');
  const sceneCockpit = document.getElementById('sceneCockpit');

  const heroCopy = document.getElementById('heroCopy');
  const scrollCue = document.getElementById('scrollCue');
  const camAngle = document.getElementById('camAngle');
  const chrome = document.getElementById('chrome');
  const progressFill = document.getElementById('progressFill');

  const doorTop = document.getElementById('doorTop');
  const doorBottom = document.getElementById('doorBottom');
  const doorCaption = document.getElementById('doorCaption');

  const wheel = document.getElementById('wheel');
  const stopNum = document.getElementById('stopNum');
  const stopName = document.getElementById('stopName');
  const cockpitHint = document.getElementById('cockpitHint');
  const cvPanels = Array.from(document.querySelectorAll('.cv-panel'));
  const dots = Array.from(document.querySelectorAll('.dash-dots__dot'));

  const skipBtn = document.getElementById('skipBtn');
  skipBtn.addEventListener('click', () => {
    sceneCockpit.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  /* --------------------------------------------------------------- loader */
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  let videoReady = false;

  function finishLoading(){
    loaderFill.style.width = '100%';
    setTimeout(() => loader.classList.add('is-hidden'), 220);
  }

  video.addEventListener('progress', () => {
    if (video.buffered.length && video.duration){
      const pct = (video.buffered.end(0) / video.duration) * 100;
      loaderFill.style.width = Math.min(pct, 96) + '%';
    }
  });
  video.addEventListener('loadedmetadata', () => { videoReady = true; });
  video.addEventListener('canplaythrough', finishLoading);
  // Safety net: never trap the user behind the loader.
  setTimeout(finishLoading, 4500);
  video.load();

  /* ------------------------------------------------------------- helpers */
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  function progressOf(el){
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    if (total <= 0) return rect.top <= 0 ? 1 : 0;
    return clamp(-rect.top / total);
  }

  /* ------------------------------------------------------------ rAF loop */
  let ticking = false;

  function render(){
    ticking = false;

    /* ---- global progress bar ---- */
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    progressFill.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    chrome.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.15);

    /* ---- scene 1 : video reveal ---- */
    const pVideo = progressOf(sceneVideo);
    if (videoReady && video.duration){
      video.currentTime = pVideo * (video.duration - 0.05);
    }
    heroCopy.style.opacity = 1 - clamp(pVideo / 0.18);
    heroCopy.style.transform = `translateY(${lerp(0, -40, clamp(pVideo / 0.18))}px)`;
    scrollCue.style.opacity = pVideo > 0.06 ? 0 : 1;
    const camStep = Math.min(3, Math.floor(pVideo * 3) + 1);
    camAngle.textContent = 'CAM 0' + camStep;
    skipBtn.classList.toggle('is-hidden', pVideo > 0.03);

    /* ---- scene 2 : door split ---- */
    const pDoor = progressOf(sceneDoor);
    const eased = pDoor * pDoor * (3 - 2 * pDoor); // smoothstep
    doorTop.style.transform = `translateY(${lerp(0, -100, eased)}%)`;
    doorBottom.style.transform = `translateY(${lerp(0, 100, eased)}%)`;
    doorCaption.style.opacity = 1 - clamp(pDoor / 0.5);

    /* ---- scene 3 : cockpit wheel ---- */
    const pCockpit = progressOf(sceneCockpit);
    const stops = PANELS.length;
    const rotation = pCockpit * stops * 210; // degrees of travel per stop
    wheel.style.transform = `rotate(${rotation}deg)`;

    const activeIndex = Math.min(stops - 1, Math.floor(pCockpit * stops));
    cvPanels.forEach((panel, i) => panel.classList.toggle('is-active', i === activeIndex));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
    stopNum.textContent = PANELS[activeIndex].stop;
    stopName.textContent = PANELS[activeIndex].gauge;
    cockpitHint.style.opacity = pCockpit > 0.08 ? 0 : 1;
  }

  function onScroll(){
    if (!ticking){
      requestAnimationFrame(render);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  render();
})();
