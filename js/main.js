// Handles the mobile navigation toggle and closes it when a link is clicked.
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const brandMark = document.querySelector('.brand-mark');
  const brandLetters = Array.from(document.querySelectorAll('.brand-text .letter'));
  let brandActiveColor = null;
  let trainStarted = false;

  if (!navToggle || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  };

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  // Sync brand dot to the active page color.
  const activeLink = navLinks.querySelector('.active');
  if (brandMark && activeLink) {
    const activeColorRaw =
      getComputedStyle(activeLink).getPropertyValue('--underline-color') ||
      getComputedStyle(activeLink).color;
    if (activeColorRaw) {
      brandActiveColor = activeColorRaw.trim();
      brandMark.style.background = brandActiveColor;
      brandMark.style.boxShadow = `0 0 0 6px ${brandActiveColor}22`;
    }
  }

  // Bounce the brand dot once on load.
  if (brandMark) {
    brandMark.classList.add('brand-bounce');
    brandMark.addEventListener('animationend', (event) => {
      if (event.animationName === 'brand-bounce') {
        brandMark.classList.remove('brand-bounce');
        startTrain();
      }
    });
  }

  // Animate brand letters like a passing train of palette colors.
  const rootStyles = getComputedStyle(document.documentElement);
  const baseColor = rootStyles.getPropertyValue('--text-light').trim() || 'var(--text-light)';
  const activeColor = brandActiveColor || baseColor;

  const startTrain = () => {
    if (trainStarted) return;
    trainStarted = true;
    if (!brandLetters.length) return;
    const totalSteps = brandLetters.length;
    let step = 0;
    const tick = () => {
      brandLetters.forEach((letter, idx) => {
        letter.style.color = idx === step ? activeColor : baseColor;
      });
      step += 1;
      if (step > totalSteps) {
        brandLetters.forEach((letter) => (letter.style.color = baseColor));
      } else {
        setTimeout(tick, 110);
      }
    };
    setTimeout(tick, 120);
  };

  // Fallback: if no bounce runs, start the train shortly after load.
  if (!brandMark) {
    startTrain();
  }

  // Delay-start the train midway through the bounce for quicker sync.
  if (brandMark) {
    setTimeout(startTrain, 350);
  }
});
