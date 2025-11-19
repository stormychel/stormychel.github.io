// Testimonials Carousel Functionality
(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  function initCarousel() {
    const carousel = document.getElementById('comp-lqizp7fs');
    if (!carousel) return;

    const slidesWrapper = carousel.querySelector('[data-testid="slidesWrapper"]');
    const prevButton = carousel.querySelector('[data-testid="prevButton"]');
    const nextButton = carousel.querySelector('[data-testid="nextButton"]');
    const dotsNav = carousel.querySelector('nav ol');

    if (!slidesWrapper || !prevButton || !nextButton || !dotsNav) return;

    const slides = Array.from(slidesWrapper.querySelectorAll('.imK94d'));
    const dots = Array.from(dotsNav.querySelectorAll('li'));
    let currentSlide = 0;

    // Hide all slides except the first one
    function updateSlides() {
      slides.forEach((slide, index) => {
        if (index === currentSlide) {
          slide.style.display = 'block';
          slide.style.opacity = '1';
        } else {
          slide.style.display = 'none';
          slide.style.opacity = '0';
        }
      });

      // Update dots
      dots.forEach((dot, index) => {
        const link = dot.querySelector('a');
        if (index === currentSlide) {
          dot.setAttribute('aria-current', 'true');
          link.classList.add('Ale4Rm');
        } else {
          dot.removeAttribute('aria-current');
          link.classList.remove('Ale4Rm');
        }
      });

      // Update aria-live for accessibility
      slidesWrapper.setAttribute('aria-live', 'polite');
    }

    // Navigate to specific slide
    function goToSlide(index) {
      if (index < 0) {
        currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }
      updateSlides();
    }

    // Previous button
    prevButton.addEventListener('click', function(e) {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    });

    // Next button
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    });

    // Dots navigation
    dots.forEach((dot, index) => {
      const link = dot.querySelector('a');
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          goToSlide(index);
        });
      }
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      }
    });

    // Optional: Auto-play (uncomment to enable)
    // setInterval(function() {
    //   goToSlide(currentSlide + 1);
    // }, 5000);

    // Initialize
    updateSlides();
  }
})();
