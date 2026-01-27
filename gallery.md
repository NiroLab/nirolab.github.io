---
layout: default
title: Gallery
---

<section class="page">
  <div class="container">
    <header class="page-header">
      <h1 class="page-title">Photo Gallery</h1>
      <p class="page-subtitle">Moments from our lab, events, and research activities</p>
    </header>

    <div class="under-development-notice">
      <p>This section is currently under development. Check back soon for photos from our lab activities.</p>
    </div>

    <!-- Gallery Filter -->
    <div class="gallery-filter">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="lab">Lab</button>
      <button class="filter-btn" data-filter="events">Events</button>
      <button class="filter-btn" data-filter="research">Research</button>
      <button class="filter-btn" data-filter="team">Team</button>
    </div>

    <!-- Gallery Grid -->
    <div class="gallery-grid">
      {% for item in site.data.gallery %}
      <div class="gallery-item" data-category="{{ item.category }}">
        <a href="{{ item.image | relative_url }}" class="gallery-link" data-caption="{{ item.caption }}">
          <img src="{{ item.image | relative_url }}" alt="{{ item.caption }}" loading="lazy">
          <div class="gallery-overlay">
            <span class="gallery-caption">{{ item.caption }}</span>
          </div>
        </a>
      </div>
      {% endfor %}
    </div>

  </div>
</section>

<!-- Lightbox -->
<div class="lightbox" id="lightbox">
  <button class="lightbox-close" aria-label="Close">&times;</button>
  <button class="lightbox-prev" aria-label="Previous">&lsaquo;</button>
  <button class="lightbox-next" aria-label="Next">&rsaquo;</button>
  <div class="lightbox-content">
    <img src="" alt="" id="lightbox-img">
    <p class="lightbox-caption" id="lightbox-caption"></p>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Filter functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const galleryLinks = document.querySelectorAll('.gallery-link');
  let currentIndex = 0;
  let visibleItems = [];

  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  function openLightbox(index) {
    updateVisibleItems();
    currentIndex = index;
    const link = visibleItems[index].querySelector('.gallery-link');
    lightboxImg.src = link.href;
    lightboxCaption.textContent = link.dataset.caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    updateVisibleItems();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    const link = visibleItems[currentIndex].querySelector('.gallery-link');
    lightboxImg.src = link.href;
    lightboxCaption.textContent = link.dataset.caption;
  }

  function showNext() {
    updateVisibleItems();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    const link = visibleItems[currentIndex].querySelector('.gallery-link');
    lightboxImg.src = link.href;
    lightboxCaption.textContent = link.dataset.caption;
  }

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      updateVisibleItems();
      const itemIndex = visibleItems.indexOf(this.closest('.gallery-item'));
      openLightbox(itemIndex);
    });
  });

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev').addEventListener('click', showPrev);
  document.querySelector('.lightbox-next').addEventListener('click', showNext);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
});
</script>
