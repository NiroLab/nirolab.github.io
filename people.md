---
layout: default
title: People
---

<section class="page">
  <div class="container">
    <header class="page-header">
      <h1 class="page-title">People</h1>
      <p class="page-subtitle">Meet our team of researchers and students</p>
    </header>

    <!-- Faculty -->
    <div class="people-section">
      <h3>Faculty</h3>
      <div class="people-grid">
        {% assign faculty = site.people | where: "category", "faculty" | sort: "order" %}
        {% for person in faculty %}
        <div class="person-card">
          <a href="{{ person.url | relative_url }}">
            <div class="person-image">
              {% if person.image %}
              <img src="{{ person.image | relative_url }}" alt="{{ person.name }}">
              {% else %}
              <div class="placeholder-image">{{ person.name | slice: 0 }}</div>
              {% endif %}
            </div>
          </a>
          <h4 class="person-name">
            <a href="{{ person.url | relative_url }}">{{ person.name }}</a>
          </h4>
          <p class="person-role">{{ person.role }}</p>
          {% if person.email %}
          <p class="person-email"><a href="mailto:{{ person.email }}">{{ person.email }}</a></p>
          {% endif %}
        </div>
        {% endfor %}
      </div>
    </div>

    <!-- Research Assistants -->
    <div class="people-section">
      <h3>Research Assistants</h3>
      <div class="people-grid">
        {% assign ras = site.people | where: "category", "ra" | sort: "order" %}
        {% for person in ras %}
        <div class="person-card">
          <a href="{{ person.url | relative_url }}">
            <div class="person-image">
              {% if person.image %}
              <img src="{{ person.image | relative_url }}" alt="{{ person.name }}">
              {% else %}
              <div class="placeholder-image">{{ person.name | slice: 0 }}</div>
              {% endif %}
            </div>
          </a>
          <h4 class="person-name">
            <a href="{{ person.url | relative_url }}">{{ person.name }}</a>
          </h4>
          <p class="person-role">{{ person.role }}</p>
          {% if person.email %}
          <p class="person-email"><a href="mailto:{{ person.email }}">{{ person.email }}</a></p>
          {% endif %}
        </div>
        {% endfor %}
      </div>
    </div>

    <!-- Student Researchers -->
    <div class="people-section">
      <h3>Student Researchers</h3>
      <div class="people-grid">
        {% assign students = site.people | where: "category", "student" | sort: "order" %}
        {% for person in students %}
        <div class="person-card">
          <a href="{{ person.url | relative_url }}">
            <div class="person-image">
              {% if person.image %}
              <img src="{{ person.image | relative_url }}" alt="{{ person.name }}">
              {% else %}
              <div class="placeholder-image">{{ person.name | slice: 0 }}</div>
              {% endif %}
            </div>
          </a>
          <h4 class="person-name">
            <a href="{{ person.url | relative_url }}">{{ person.name }}</a>
          </h4>
          <p class="person-role">{{ person.role }}</p>
          {% if person.email %}
          <p class="person-email"><a href="mailto:{{ person.email }}">{{ person.email }}</a></p>
          {% endif %}
        </div>
        {% endfor %}
      </div>
    </div>

    <!-- Alumni -->
    <div class="people-section">
      <h3>Alumni</h3>
      <div class="people-grid">
        {% assign alumni = site.people | where: "category", "alumni" | sort: "order" %}
        {% for person in alumni %}
        <div class="person-card">
          <a href="{{ person.url | relative_url }}">
            <div class="person-image">
              {% if person.image %}
              <img src="{{ person.image | relative_url }}" alt="{{ person.name }}">
              {% else %}
              <div class="placeholder-image">{{ person.name | slice: 0 }}</div>
              {% endif %}
            </div>
          </a>
          <h4 class="person-name">
            <a href="{{ person.url | relative_url }}">{{ person.name }}</a>
          </h4>
          <p class="person-role">{{ person.role }}</p>
          {% if person.current_position %}
          <p class="person-role" style="font-style: italic;">Now: {{ person.current_position }}</p>
          {% endif %}
        </div>
        {% endfor %}
      </div>
    </div>

  </div>
</section>
