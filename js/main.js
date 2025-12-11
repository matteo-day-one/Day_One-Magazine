// Handles the mobile navigation toggle and closes it when a link is clicked.
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const brandMark = document.querySelector('.brand-mark');
  const brandLetters = Array.from(document.querySelectorAll('.brand-text .letter'));

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
    const activeColor =
      getComputedStyle(activeLink).getPropertyValue('--underline-color') ||
      getComputedStyle(activeLink).color;
    if (activeColor) {
      brandMark.style.background = activeColor.trim();
      brandMark.style.boxShadow = `0 0 0 6px ${activeColor.trim()}22`;
    }
  }

  // Bounce the brand dot once on load.
  if (brandMark) {
    brandMark.classList.add('brand-bounce');
    brandMark.addEventListener('animationend', (event) => {
      if (event.animationName === 'brand-bounce') {
        brandMark.classList.remove('brand-bounce');
      }
    });
  }

  // Animate brand letters like a passing train of palette colors.
  const palette = ['var(--teal)', 'var(--deep-teal)', 'var(--yellow)', 'var(--orange)'];
  const resetColor = 'var(--text-light)';
  if (brandLetters.length) {
    const totalSteps = brandLetters.length + palette.length;
    let step = 0;
    const tick = () => {
      brandLetters.forEach((letter, idx) => {
        const paletteIndex = step - idx;
        if (paletteIndex >= 0 && paletteIndex < palette.length) {
          letter.style.color = palette[paletteIndex];
        } else {
          letter.style.color = resetColor;
        }
      });
      step += 1;
      if (step > totalSteps) {
        brandLetters.forEach((letter) => (letter.style.color = resetColor));
      } else {
        setTimeout(tick, 110);
      }
    };
    setTimeout(tick, 150);
  }
});
