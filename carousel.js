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
    if (!carousel) {
      console.error('Carousel not found');
      return;
    }

    const slidesWrapper = carousel.querySelector('[data-testid="slidesWrapper"]');
    const prevButton = carousel.querySelector('[data-testid="prevButton"]');
    const nextButton = carousel.querySelector('[data-testid="nextButton"]');
    const dotsNav = carousel.querySelector('nav ol');

    if (!slidesWrapper || !prevButton || !nextButton || !dotsNav) {
      console.error('Carousel elements not found');
      return;
    }

    // Get all slides - they have class 'imK94d'
    const slides = Array.from(slidesWrapper.querySelectorAll('.imK94d'));
    const dots = Array.from(dotsNav.querySelectorAll('li'));

    console.log('Found', slides.length, 'slides');

    if (slides.length === 0) {
      console.error('No slides found');
      return;
    }

    let currentSlide = 0;

    // Style slides for proper visibility control
    // Since they're absolutely positioned, use z-index and opacity
    function updateSlides() {
      slides.forEach((slide, index) => {
        if (index === currentSlide) {
          slide.style.zIndex = '10';
          slide.style.opacity = '1';
          slide.style.visibility = 'visible';
          slide.style.pointerEvents = 'auto';
        } else {
          slide.style.zIndex = '1';
          slide.style.opacity = '0';
          slide.style.visibility = 'hidden';
          slide.style.pointerEvents = 'none';
        }
      });

      // Update dots
      dots.forEach((dot, index) => {
        const link = dot.querySelector('a');
        if (index === currentSlide) {
          dot.setAttribute('aria-current', 'true');
          if (link) link.classList.add('Ale4Rm');
        } else {
          dot.removeAttribute('aria-current');
          if (link) link.classList.remove('Ale4Rm');
        }
      });

      // Update aria-live for accessibility
      slidesWrapper.setAttribute('aria-live', 'polite');

      console.log('Current slide:', currentSlide);
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
      console.log('Previous clicked');
      goToSlide(currentSlide - 1);
    });

    // Next button
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Next clicked');
      goToSlide(currentSlide + 1);
    });

    // Dots navigation
    dots.forEach((dot, index) => {
      const link = dot.querySelector('a');
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('Dot', index, 'clicked');
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

    // Make carousel focusable for keyboard navigation
    carousel.setAttribute('tabindex', '0');

    // Optional: Auto-play (uncomment to enable)
    // let autoplayInterval = setInterval(function() {
    //   goToSlide(currentSlide + 1);
    // }, 5000);

    // // Pause autoplay on hover
    // carousel.addEventListener('mouseenter', function() {
    //   clearInterval(autoplayInterval);
    // });

    // carousel.addEventListener('mouseleave', function() {
    //   autoplayInterval = setInterval(function() {
    //     goToSlide(currentSlide + 1);
    //   }, 5000);
    // });

    // Add transition CSS
    const style = document.createElement('style');
    style.textContent = `
      .imK94d {
        transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out !important;
      }
    `;
    document.head.appendChild(style);

    // Initialize - show first slide
    console.log('Initializing carousel');
    updateSlides();
  }
})();
