/* ---------------- DATA ---------------- */
  const swatches = ['#5C1A1A','#3A6B63','#B08D57','#7A2626','#274d47','#8a6a3d'];
  function gradientFor(i){
    const a = swatches[i % swatches.length];
    const b = swatches[(i+3) % swatches.length];
    return `linear-gradient(135deg, ${a}, ${b})`;
  }
  // Real photo placeholders (picsum.photos) so the cards look like actual product photography.
  // Each record gets a fixed seed so the same item always shows the same photo.
  function photoFor(i){
    return `https://picsum.photos/seed/vinyl${i}/400/400`;
  }
  function artStyleFor(i){
    return `background-image:url('${photoFor(i)}'); background-size:cover; background-position:center;`;
  }

  const spinning = [
    {title:"Midnight Coast", artist:"The Amber Room", price:"$28"},
    {title:"Low Tide Blues", artist:"Coretta Vance", price:"$32"},
    {title:"Seven Rivers", artist:"Nkechi Obi", price:"$24"},
    {title:"Analog Heart", artist:"Dusk Parade", price:"$30"},
    {title:"Field Notes", artist:"Marlon Ash", price:"$26"},
    {title:"Slow Static", artist:"The Amber Room", price:"$29"},
  ];

  const fullCatalog = [
    "Blue Hour Sessions","Copper & Rust","Cathedral City","Night Bus Home",
    "Marigold Radio","Salt Air","Backroom Tapes","Velvet Static",
    "Harbor Light","Paper Moon Blues","Windowseat","Afterglow",
    "Low Country","Wax & Wane","Tin Roof Sessions","Northbound",
    "Rearview Soul","Corner Store Jazz","Dust & Gold","Late Checkout"
  ];
  const artists = ["The Amber Room","Coretta Vance","Nkechi Obi","Dusk Parade","Marlon Ash","Ruth Calloway","The Slow Vine"];

  /* ---------------- SLIDER ---------------- */
  const sliderTrack = document.getElementById('sliderTrack');
  spinning.forEach((rec,i)=>{
    const card = document.createElement('div');
    card.className='record-card';
    card.innerHTML = `
      <div class="record-art" style="${artStyleFor(i)}"></div>
      <h3>${rec.title}</h3>
      <div class="artist">${rec.artist}</div>
      <div class="price-row">
        <span class="price">${rec.price}</span>
        <span class="tag-side">A${i+1}</span>
      </div>`;
    sliderTrack.appendChild(card);
  });
  document.getElementById('sliderNext').addEventListener('click', ()=>{
    sliderTrack.scrollBy({left: 260, behavior:'smooth'});
  });
  document.getElementById('sliderPrev').addEventListener('click', ()=>{
    sliderTrack.scrollBy({left: -260, behavior:'smooth'});
  });

  /* ---------------- CATALOG + DYNAMIC LOAD MORE ---------------- */
  const catalogGrid = document.getElementById('catalogGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const PAGE_SIZE = 8;
  let loaded = 0;

  function renderPage(){
    const next = fullCatalog.slice(loaded, loaded + PAGE_SIZE);
    next.forEach((title, idx)=>{
      const globalIdx = loaded + idx;
      const card = document.createElement('div');
      card.className = 'catalog-card';
      card.style.animationDelay = (idx * 0.06) + 's';
      const artist = artists[globalIdx % artists.length];
      card.innerHTML = `
        <div class="record-art" style="${artStyleFor(globalIdx+20)}"></div>
        <h3>${title}</h3>
        <div class="artist">${artist}</div>
        <div class="price-row">
          <span class="price mono">$${(22 + (globalIdx % 6) * 2)}</span>
          <span class="tag-side">${globalIdx % 2 === 0 ? 'A' : 'B'}${(globalIdx % 6) + 1}</span>
        </div>`;
      catalogGrid.appendChild(card);
    });
    loaded += next.length;
    if(loaded >= fullCatalog.length){
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'All records shown';
    }
  }
  renderPage();

  loadMoreBtn.addEventListener('click', ()=>{
    loadMoreBtn.classList.add('loading');
    loadMoreBtn.querySelector('.dots') || (loadMoreBtn.innerHTML = 'Loading <span class="dots"></span>');
    // simulate a network fetch for "dynamic content loading"
    setTimeout(()=>{
      renderPage();
      loadMoreBtn.classList.remove('loading');
      if(!loadMoreBtn.disabled){
        loadMoreBtn.innerHTML = 'More Records <span class="dots"></span>';
      }
    }, 650);
  });

  /* ---------------- MOBILE NAV ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mobilePanel = document.getElementById('mobilePanel');
  hamburger.addEventListener('click', ()=>{
    const isOpen = hamburger.classList.toggle('open');
    mobilePanel.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  mobilePanel.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      hamburger.classList.remove('open');
      mobilePanel.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- HERO VINYL: spin briefly on load ---------------- */
  const vinylStage = document.getElementById('vinylStage');
  window.addEventListener('load', ()=>{
    vinylStage.classList.add('spin');
    setTimeout(()=> vinylStage.classList.remove('spin'), 4000);
  });

  /* ---------------- FORM VALIDATION ---------------- */
  const form = document.getElementById('requestForm');
  const successBox = document.getElementById('formSuccess');

  function setError(fieldId, message){
    const field = document.getElementById(fieldId);
    const msg = field.querySelector('.error-msg');
    if(message){
      field.classList.add('invalid');
      msg.textContent = message;
    } else {
      field.classList.remove('invalid');
      msg.textContent = '';
    }
  }

  function validate(){
    let valid = true;

    const name = document.getElementById('name').value.trim();
    if(name.length < 2){
      setError('field-name', 'Enter your name.');
      valid = false;
    } else setError('field-name', '');

    const email = document.getElementById('email').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!emailOk){
      setError('field-email', 'Enter a valid email address.');
      valid = false;
    } else setError('field-email', '');

    const record = document.getElementById('record').value.trim();
    if(record.length < 2){
      setError('field-record', 'Tell us which record you need.');
      valid = false;
    } else setError('field-record', '');

    return valid;
  }

  ['name','email','record'].forEach(id=>{
    document.getElementById(id).addEventListener('input', validate);
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(validate()){
      successBox.classList.add('show');
      form.reset();
      setTimeout(()=> successBox.classList.remove('show'), 5000);
    } else {
      successBox.classList.remove('show');
    }
  });