---
layout: presentation
title: Presentation
permalink: /presentation/
---

{% assign featured_projects = site.projects | where: "featured", true | sort: "order" %}
{% assign featured_count = featured_projects.size %}
{% assign hexabot = site.projects | where_exp: "p", "p.path contains 'hexabot'" | first %}

<div class="presentation-container" id="presentation">
  <div class="presentation-progress"><div class="progress-bar" id="progress-bar"></div></div>

  <!-- Slide 1: Welcome -->
  <section class="presentation-slide slide-dark active" data-slide="0">
    <div class="slide-content">
      <div class="slide-logo">
        <img src="{{ '/assets/NIRO LOGO.png' | relative_url }}" alt="NIRO Lab Logo">
      </div>
      <h1>NIRO Lab</h1>
      <p class="slide-subtitle">NSU Intelligent Robotics Lab</p>
      <p class="slide-tagline">Established October 2024 at North South University</p>
    </div>
  </section>

  <!-- Slide 2: Mission -->
  <section class="presentation-slide slide-light" data-slide="1">
    <div class="slide-content slide-content-narrow">
      <span class="slide-label">Our Mission</span>
      <h2>What We Do</h2>
      <div class="mission-list">
        <div class="mission-item">
          <span class="mission-icon">&#128300;</span>
          <p>Conduct cutting-edge research in robotics and AI that addresses real-world challenges</p>
        </div>
        <div class="mission-item">
          <span class="mission-icon">&#127891;</span>
          <p>Provide exceptional research training and mentorship to students at all levels</p>
        </div>
        <div class="mission-item">
          <span class="mission-icon">&#129309;</span>
          <p>Foster partnerships with industry, government, and academic institutions</p>
        </div>
        <div class="mission-item">
          <span class="mission-icon">&#128161;</span>
          <p>Translate research outcomes into practical applications that benefit society</p>
        </div>
        <div class="mission-item">
          <span class="mission-icon">&#127758;</span>
          <p>Create an inclusive and collaborative research environment that inspires creativity</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Slide 3: Vision -->
  <section class="presentation-slide slide-alt" data-slide="2">
    <div class="slide-content slide-content-narrow">
      <span class="slide-label">Our Vision</span>
      <h2>Where We Are Headed</h2>
      <p class="slide-lead">To serve as the cornerstone of a self-sustaining robotics ecosystem in Bangladesh.</p>
      <div class="vision-block">
        <p>We envision a future where the gap between theoretical academic research and industrial application is seamlessly bridged, positioning our nation as a significant contributor to the global robotics revolution.</p>
      </div>
      <p class="slide-tagline" style="margin-top: var(--spacing-xl);">Transforming "impossible" ideas into functional, intelligent solutions.</p>
    </div>
  </section>

  <!-- Slide 4: Innovation Cycle -->
  <section class="presentation-slide slide-light" data-slide="3">
    <div class="slide-content">
      <span class="slide-label">How We Work</span>
      <h2>Our Innovation Cycle</h2>
      <div class="innovation-graphic">
        <img src="{{ '/assets/Robot%20Innovation%20Cycle.png' | relative_url }}" alt="NIRO Lab Innovation Cycle">
      </div>
    </div>
  </section>

  <!-- Slide 5: Research Areas -->
  <section class="presentation-slide slide-alt" data-slide="4">
    <div class="slide-content">
      <h2>Research Areas</h2>
      <div class="research-grid">
        <div class="research-item">
          <span class="research-icon">&#129302;</span>
          <span>AI-driven robotics</span>
        </div>
        <div class="research-item">
          <span class="research-icon">&#128640;</span>
          <span>Multi-Robot Systems</span>
        </div>
        <div class="research-item">
          <span class="research-icon">&#128267;</span>
          <span>Edge AI computing</span>
        </div>
        <div class="research-item">
          <span class="research-icon">&#128663;</span>
          <span>Autonomous systems</span>
        </div>
        <div class="research-item">
          <span class="research-icon">&#9992;</span>
          <span>Aerial &amp; Underwater Robotics</span>
        </div>
        <div class="research-item">
          <span class="research-icon">&#129504;</span>
          <span>Adaptive Decision Making</span>
        </div>
        <div class="research-item">
          <span class="research-icon">&#128200;</span>
          <span>Uncertainty Quantification</span>
        </div>
        <div class="research-item">
          <span class="research-icon">&#128187;</span>
          <span>IoT, Cloud &amp; Blockchain Integration</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Slide 6-8: Featured Projects -->
  {% for project in featured_projects %}
  <section class="presentation-slide slide-project" data-slide="{{ forloop.index0 | plus: 5 }}">
    <div class="slide-content slide-content-split">
      <div class="project-text">
        <span class="slide-label">Featured Project</span>
        <h2>{{ project.title }}</h2>
        <p class="slide-lead">{{ project.description }}</p>
        {% if project.duration %}
        <p class="project-meta-line"><strong>Duration:</strong> {{ project.duration }}</p>
        {% endif %}
        {% if project.team %}
        <p class="project-meta-line"><strong>Team:</strong> {{ project.team | join: ", " }}</p>
        {% endif %}
      </div>
      {% if project.image %}
      <div class="project-visual">
        <img src="{{ project.image | relative_url }}" alt="{{ project.title }}">
      </div>
      {% endif %}
    </div>
  </section>
  {% endfor %}

  <!-- Slide: Project Hexa -->
  {% if hexabot %}
  <section class="presentation-slide slide-project" data-slide="{{ featured_count | plus: 5 }}">
    <div class="slide-content slide-content-split">
      <div class="project-text">
        <span class="slide-label">Research Project</span>
        <h2>{{ hexabot.title }}</h2>
        <p class="slide-lead">{{ hexabot.description }}</p>
        {% if hexabot.duration %}
        <p class="project-meta-line"><strong>Duration:</strong> {{ hexabot.duration }}</p>
        {% endif %}
      </div>
      {% if hexabot.image %}
      <div class="project-visual">
        <img src="{{ hexabot.image | relative_url }}" alt="{{ hexabot.title }}">
      </div>
      {% endif %}
    </div>
  </section>
  {% endif %}

  <!-- Slide: BEAR Summit -->
  <section class="presentation-slide slide-dark slide-bear" data-slide="{{ featured_count | plus: 6 }}">
    <div class="slide-content">
      <span class="slide-label">Achievements</span>
      <h2>BEAR Summit 2025</h2>
      <div class="bear-visual-grid">
        <div class="bear-visual-card">
          <div class="bear-image">
            <img src="{{ '/assets/images/news/bear-summit-2025-3.jpg' | relative_url }}" alt="Championship Award at BEAR Summit 2025">
          </div>
          <div class="bear-text">
            <h3>Championship Award</h3>
            <p>Autonomous Delivery Robot received top honors</p>
          </div>
        </div>
        <div class="bear-visual-card">
          <div class="bear-image">
            <img src="{{ '/assets/images/news/NIROBEARCREST.jpg' | relative_url }}" alt="Top 3 at BEAR Summit 2025">
          </div>
          <div class="bear-text">
            <h3>Top 3 Finish</h3>
            <p>NIRO EDU BOT secured podium in Robotics segment</p>
          </div>
        </div>
        <div class="bear-visual-card">
          <div class="bear-image">
            <img src="{{ '/assets/images/news/bear-summit-panel-2025.jpg' | relative_url }}" alt="Panel at BEAR Summit 2025">
          </div>
          <div class="bear-text">
            <h3>Panel Moderation</h3>
            <p>Dr. Shahnewaz Siddique led Robotics &amp; Industry 4.0 panel</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Slide: Get Involved -->
  <section class="presentation-slide slide-alt" data-slide="{{ featured_count | plus: 7 }}">
    <div class="slide-content slide-content-narrow">
      <h2>Get Involved</h2>
      <p class="slide-lead">We welcome collaborations, research opportunities, and partnerships.</p>
      <div class="contact-block">
        <p><strong>Email:</strong> <a href="mailto:{{ site.email }}">{{ site.email }}</a></p>
        <p><strong>Location:</strong> North South University, Bashundhara, Dhaka-1229, Bangladesh</p>
      </div>
      <p class="slide-url">nirolab.github.io</p>
    </div>
  </section>

  <!-- Navigation -->
  <div class="presentation-nav">
    <button class="presentation-nav-btn prev" aria-label="Previous slide">&#8249;</button>
    <div class="presentation-dots"></div>
    <button class="presentation-nav-btn next" aria-label="Next slide">&#8250;</button>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.presentation-slide');
  const dotsContainer = document.querySelector('.presentation-dots');
  const prevBtn = document.querySelector('.presentation-nav-btn.prev');
  const nextBtn = document.querySelector('.presentation-nav-btn.next');
  const progressBar = document.getElementById('progress-bar');
  const container = document.getElementById('presentation');

  if (slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const intervalTime = 10000;
  let autoPlay;
  let progressInterval;
  let progressStart;
  let isPlaying = true;
  let hoverPaused = false;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('presentation-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => { manualNavigate(); goToSlide(i); });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.presentation-dot');

  function updateSlides() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
    if (isPlaying && !hoverPaused) resetProgress();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlides();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlides();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlides();
  }

  function resetProgress() {
    progressStart = Date.now();
  }

  function updateProgress() {
    const elapsed = Date.now() - progressStart;
    const pct = Math.min((elapsed / intervalTime) * 100, 100);
    progressBar.style.width = pct + '%';
  }

  function startAutoPlay() {
    if (!isPlaying) return;
    stopAutoPlay();
    resetProgress();
    autoPlay = setInterval(nextSlide, intervalTime);
    progressInterval = setInterval(updateProgress, 50);
    progressBar.style.opacity = '1';
  }

  function stopAutoPlay() {
    clearInterval(autoPlay);
    clearInterval(progressInterval);
    autoPlay = null;
    progressInterval = null;
    progressBar.style.width = '0%';
    progressBar.style.opacity = '0.5';
  }

  function manualNavigate() {
    isPlaying = false;
    stopAutoPlay();
  }

  function toggleAutoPlay() {
    if (isPlaying) {
      isPlaying = false;
      stopAutoPlay();
    } else {
      isPlaying = true;
      startAutoPlay();
    }
  }

  prevBtn.addEventListener('click', () => { manualNavigate(); prevSlide(); });
  nextBtn.addEventListener('click', () => { manualNavigate(); nextSlide(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { manualNavigate(); prevSlide(); }
    if (e.key === 'ArrowRight') { manualNavigate(); nextSlide(); }
    if (e.key === ' ') { e.preventDefault(); toggleAutoPlay(); }
  });

  container.addEventListener('mouseenter', () => {
    if (isPlaying) {
      hoverPaused = true;
      stopAutoPlay();
    }
  });

  container.addEventListener('mouseleave', () => {
    if (isPlaying && hoverPaused) {
      hoverPaused = false;
      startAutoPlay();
    }
  });

  startAutoPlay();
});
</script>
