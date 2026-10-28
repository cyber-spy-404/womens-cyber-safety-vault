// ========================================================
// KEYNOTE PRESENTATION CONTROLLER
// Apple HIG Pro Interaction Engine & Keyboard Navigation
// ========================================================

(function () {
  'use strict';

  let currentSlide = 1;
  const totalSlides = 8;
  let slides = [];
  let counterEl, progressBar, prevBtn, nextBtn;

  function initDeck() {
    slides = Array.from(document.querySelectorAll('.slide'));
    counterEl = document.getElementById('deck-counter');
    progressBar = document.getElementById('deck-progress-bar');
    prevBtn = document.getElementById('btn-deck-prev');
    nextBtn = document.getElementById('btn-deck-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    // Quick Jump Navigation Buttons
    const jumpMap = [
      { id: 'btn-jump-title', slide: 1 },
      { id: 'btn-jump-crypto', slide: 3 },
      { id: 'btn-jump-statute', slide: 5 },
      { id: 'btn-jump-roadmap', slide: 8 }
    ];

    jumpMap.forEach(({ id, slide }) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          showSlide(slide);
        });
      }
    });

    // Fullscreen Toggle
    const fullscreenBtn = document.getElementById('btn-fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFullscreen();
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        showSlide(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        showSlide(totalSlides);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    });

    // Touch Swipe Gestures for Mobile / iPad
    let touchStartX = 0;
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Minimum 40px horizontal swipe without vertical scrolling intent
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });

    // Live Cryptographic Engine Demonstration on Slide 3
    const hashInput = document.getElementById('demo-hash-input');
    const hashOutput = document.getElementById('demo-hash-output');

    async function computeDemoHash(text) {
      if (!window.crypto || !window.crypto.subtle) return;
      try {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
        const hashArray = Array.from(new Uint8Array(buf));
        const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        if (hashOutput) {
          hashOutput.textContent = `SHA-256: ${hex}`;
          hashOutput.title = hex;
        }
      } catch (e) {
        console.warn('Demo hash error:', e);
      }
    }

    if (hashInput) {
      computeDemoHash(hashInput.value);
      hashInput.addEventListener('input', (e) => computeDemoHash(e.target.value));
    }

    // Initial Slide Resolution from URL hash or default
    const hashMatch = window.location.hash.match(/slide-(\d+)/);
    if (hashMatch && hashMatch[1]) {
      showSlide(parseInt(hashMatch[1], 10));
    } else {
      showSlide(1);
    }
  }

  function showSlide(index) {
    if (index < 1) index = 1;
    if (index > totalSlides) index = totalSlides;
    currentSlide = index;

    slides.forEach((slide, idx) => {
      const slideNum = idx + 1;
      slide.classList.remove('active', 'prev');
      if (slideNum === currentSlide) {
        slide.classList.add('active');
      } else if (slideNum < currentSlide) {
        slide.classList.add('prev');
      }
    });

    // Update Counter
    if (counterEl) {
      counterEl.textContent = `Slide ${String(currentSlide).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    }

    // Update Progress Bar
    if (progressBar) {
      const pct = (currentSlide / totalSlides) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // URL hash sync
    try {
      history.replaceState(null, null, `#slide-${currentSlide}`);
    } catch (e) {}
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      showSlide(currentSlide + 1);
    } else {
      showSlide(1); // loop back to start
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      showSlide(currentSlide - 1);
    } else {
      showSlide(totalSlides); // loop to end
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  // Self-execute on DOM readiness
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeck);
  } else {
    initDeck();
  }
})();
