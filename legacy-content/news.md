---
layout: default
title: News
---

<section class="page">
  <div class="container">
    <header class="page-header">
      <h1 class="page-title">News</h1>
      <p class="page-subtitle">Latest updates from NIRO Lab</p>
    </header>

    <div class="news-list">
      {% for post in site.posts %}
      <div class="news-item">
        <div class="news-date">
          <span class="day">{{ post.date | date: "%d" }}</span>
          <span class="month">{{ post.date | date: "%b" }}</span>
        </div>
        <div class="news-content">
          <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
        </div>
      </div>
      {% endfor %}

      {% if site.posts.size == 0 %}
      <p style="text-align: center; color: var(--color-text-light);">No news posted yet. Check back soon!</p>
      {% endif %}
    </div>

  </div>
</section>
