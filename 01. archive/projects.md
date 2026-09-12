---
layout: default
title: Projects
---

<section class="page">
  <div class="container">
    <header class="page-header">
      <h1 class="page-title">Research Projects</h1>
      <p class="page-subtitle">Our ongoing and completed research initiatives</p>
    </header>

    <div class="projects-grid">
      {% assign projects = site.projects | sort: "order" %}
      {% for project in projects %}
      <div class="card">
        {% if project.image %}
        <div class="card-image">
          <img src="{{ project.image | relative_url }}" alt="{{ project.title }}">
        </div>
        {% endif %}
        <div class="card-content">
          <h3 class="card-title">
            <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
          </h3>
          <p class="card-text">{{ project.description }}</p>
          {% if project.status %}
          <span class="project-status status-{{ project.status | downcase }}">{{ project.status }}</span>
          {% endif %}
        </div>
      </div>
      {% endfor %}
    </div>

  </div>
</section>
