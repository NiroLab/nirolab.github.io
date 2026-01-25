---
layout: default
title: Publications
---

<section class="page">
  <div class="container">
    <header class="page-header">
      <h1 class="page-title">Publications</h1>
      <p class="page-subtitle">Research papers and publications from our lab</p>
    </header>

    {% assign publications_by_year = site.data.publications | group_by: "year" | sort: "name" | reverse %}

    {% for year_group in publications_by_year %}
    <div class="publications-year">
      <h3>{{ year_group.name }}</h3>
      <ul class="publication-list">
        {% for pub in year_group.items %}
        <li class="publication-item">
          <div class="publication-title">{{ pub.title }}</div>
          <div class="publication-authors">{{ pub.authors }}</div>
          <div class="publication-venue">{{ pub.venue }}</div>
          {% if pub.pdf or pub.doi or pub.code %}
          <div class="publication-links">
            {% if pub.pdf %}<a href="{{ pub.pdf }}" target="_blank">PDF</a>{% endif %}
            {% if pub.doi %}<a href="{{ pub.doi }}" target="_blank">DOI</a>{% endif %}
            {% if pub.code %}<a href="{{ pub.code }}" target="_blank">Code</a>{% endif %}
          </div>
          {% endif %}
        </li>
        {% endfor %}
      </ul>
    </div>
    {% endfor %}

  </div>
</section>
