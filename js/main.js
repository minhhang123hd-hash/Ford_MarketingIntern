(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  const loader = $('#loader');
  const loaderFill = $('#loaderFill');
  const intro = $('#introPage');
  const portfolio = $('#portfolioPage');
  const transition = $('#transition');
  const introVideo = $('#introVideo');
  const enterBtn = $('#enterPortfolio');
  const backBtn = $('#backToIntro');

  document.body.classList.add('intro-open');

  // Smooth loader: do not wait for canplaythrough. A large video can otherwise
  // make the first seconds feel frozen. We only wait for metadata + a short
  // minimum visual delay, then let the browser continue loading in the background.
  let progress = 0;
  const loaderTimer = setInterval(() => {
    progress = Math.min(progress + 7, 92);
    loaderFill.style.width = progress + '%';
  }, 90);

  function finishLoader(){
    clearInterval(loaderTimer);
    loaderFill.style.width = '100%';
    setTimeout(() => loader.classList.add('is-hidden'), 180);
  }
  introVideo.addEventListener('loadedmetadata', () => setTimeout(finishLoader, 180));
  setTimeout(finishLoader, 1800);

  // Play normally instead of assigning currentTime on every scroll frame.
  // That old approach caused frame seeking / decoding stutter.
  introVideo.play().catch(() => {});

  function switchPage(target){
    transition.classList.remove('run');
    void transition.offsetWidth;
    transition.classList.add('run');

    setTimeout(() => {
      const openingPortfolio = target === 'portfolio';
      intro.classList.toggle('is-active', !openingPortfolio);
      portfolio.classList.toggle('is-active', openingPortfolio);
      document.body.classList.toggle('intro-open', !openingPortfolio);
      document.body.classList.toggle('portfolio-open', openingPortfolio);

      if(openingPortfolio){
        window.scrollTo({top:0, behavior:'auto'});
        introVideo.pause();
      }else{
        window.scrollTo({top:0, behavior:'auto'});
        introVideo.currentTime = 0;
        introVideo.play().catch(()=>{});
      }
    }, 480);
  }

  enterBtn.addEventListener('click', () => switchPage('portfolio'));
  backBtn.addEventListener('click', () => switchPage('intro'));

  // CV station navigation
  const navButtons = $$('#sectionNav button');
  const sections = $$('.cv-section');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  const stationNo = $('#stationNo');
  const stationName = $('#stationName');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting && entry.intersectionRatio > .25){
        const no = entry.target.dataset.station;
        const label = entry.target.dataset.label;
        stationNo.textContent = no;
        stationName.textContent = label;
        navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === entry.target.id));
      }
    });
  }, {threshold:[.25,.5], rootMargin:'-15% 0px -45% 0px'});

  sections.forEach(s => observer.observe(s));

  // Steering wheel image slot: user can drop in any transparent PNG/JPG/WebP.
  const wheelInput = $('#wheelInput');
  const wheelImage = $('#wheelImage');
  const wheelPlaceholder = $('.wheel-placeholder');
  const wheelSlot = $('#wheelSlot');

  function showWheel(file){
    if(!file || !file.type.startsWith('image/')) return;
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

  // Keyboard shortcut: Enter from intro, Escape back from portfolio.
  window.addEventListener('keydown', e => {
    if(e.key === 'Enter' && intro.classList.contains('is-active')) switchPage('portfolio');
    if(e.key === 'Escape' && portfolio.classList.contains('is-active')) switchPage('intro');
  });
})();
