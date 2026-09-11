document.addEventListener('DOMContentLoaded', () => {

  const root = document.documentElement;

  // ============ THEME TOGGLE ============
  const themeToggle = document.getElementById('theme-toggle');

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // ============ SMOOTH SCROLL (anchor offset) ============
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  // ============ CONTACT FORM ============
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      const submitBtn = contactForm.querySelector('.submit-btn');
      const btnSpan = submitBtn.querySelector('span');
      const originalText = btnSpan.textContent;

      btnSpan.textContent = 'Sending…';
      submitBtn.disabled = true;

      try {
        const response = await fetch('', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          btnSpan.textContent = '✓ Sent';
          contactForm.reset();
          setTimeout(() => {
            btnSpan.textContent = originalText;
            submitBtn.disabled = false;
          }, 2500);
        } else {
          throw new Error('Failed to send');
        }
      } catch (error) {
        btnSpan.textContent = 'Try again';
        setTimeout(() => {
          btnSpan.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  }

  // ============ SCROLL REVEAL ============
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    // Fallback — show everything if reduced motion or no support
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // ============ DOCK AUTO-HIDE ON SCROLL (mobile only) ============
  const dock = document.querySelector('.dock');
  let lastScrollY = window.scrollY;

  if (dock && window.innerWidth < 768) {
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY;

      if (scrollingDown && currentY > 200) {
        dock.classList.add('is-hidden');
      } else {
        dock.classList.remove('is-hidden');
      }

      lastScrollY = currentY;
    }, { passive: true });
  }
});