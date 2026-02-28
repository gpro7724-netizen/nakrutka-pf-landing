(function () {
  'use strict';

  var TELEGRAM_LINK = 'https://t.me/pashninburgers1';
  var API_LEAD = '/api/send-lead';

  function byId(id) { return document.getElementById(id); }
  function qs(s) { return document.querySelector(s); }
  function qsAll(s) { return document.querySelectorAll(s); }

  function sendLead(name, contact) {
    return fetch(API_LEAD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), contact: contact.trim() })
    });
  }

  function showMessage(form, text, success) {
    var msg = form.querySelector('[data-form-message]');
    if (!msg) return;
    msg.textContent = text;
    msg.setAttribute('data-success', success ? 'true' : 'false');
    msg.hidden = false;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var nameInput = form.querySelector('input[name="name"]');
    var contactInput = form.querySelector('input[name="contact"]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var name = nameInput && nameInput.value ? nameInput.value.trim() : '';
    var contact = contactInput && contactInput.value ? contactInput.value.trim() : '';

    if (!name || !contact) {
      showMessage(form, 'Заполните имя и контакт.', false);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    sendLead(name, contact)
      .then(function (res) {
        if (res.ok) {
          showMessage(form, 'Спасибо! Мы свяжемся с вами в ближайшее время.', true);
          form.reset();
        } else {
          return res.json().then(function (data) {
            throw new Error(data.error || 'Ошибка отправки');
          }).catch(function (parseErr) {
            throw new Error('Ошибка отправки. Напишите нам в Telegram: ' + TELEGRAM_LINK);
          });
        }
      })
      .catch(function (err) {
        var msg = err.message || 'Ошибка. Напишите нам в Telegram: ' + TELEGRAM_LINK;
        if (err.message && err.message.indexOf('Telegram') !== -1) {
          msg = err.message;
        }
        showMessage(form, msg, false);
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  }

  function initForms() {
    qsAll('[data-form]').forEach(function (form) {
      form.addEventListener('submit', handleSubmit);
    });
  }

  function initBurger() {
    var burger = qs('.burger');
    var nav = qs('.nav');
    var body = document.body;

    if (!burger || !nav) return;

    function open() {
      nav.classList.add('nav--open');
      nav.classList.remove('nav--closed');
      burger.setAttribute('aria-expanded', 'true');
      body.classList.add('menu-open');
    }

    function close() {
      nav.classList.remove('nav--open');
      nav.classList.add('nav--closed');
      burger.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
    }

    burger.addEventListener('click', function () {
      if (nav.classList.contains('nav--open')) close(); else open();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        close();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initSmoothScroll() {
    qsAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id === '#') return;
      var el = byId(id.slice(1));
      if (!el) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initReveal() {
    var els = qsAll('[data-reveal]');
    if (!els.length) return;
    var winH = window.innerHeight;
    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < winH + 80) el.classList.add('is-visible');
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
    els.forEach(function (el) { observer.observe(el); });
  }

  function initHeroVideo() {
    var video = qs('.hero__video');
    if (!video) return;
    video.play().catch(function () {});
    video.addEventListener('loadeddata', function () { video.play().catch(function () {}); });
    video.addEventListener('error', function () { video.classList.add('hero__video--hidden'); });
  }

  function initScrollTop() {
    var btn = byId('scroll-top');
    if (!btn) return;
    function updateVisibility() {
      btn.hidden = window.scrollY < 300;
    }
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initCasesCarousel() {
    var carousel = byId('cases-carousel');
    var prevBtn = byId('cases-prev');
    var nextBtn = byId('cases-next');
    var counterEl = byId('cases-counter');
    if (!carousel || !prevBtn || !nextBtn) return;
    var track = carousel.querySelector('.our-cases__track');
    var slides = carousel.querySelectorAll('.our-cases__slide');
    var total = slides.length;
    if (total === 0) return;
    var index = 0;
    function goTo(i) {
      index = (i + total) % total;
      if (track) track.style.transform = 'translateX(-' + index * 100 + '%)';
      if (counterEl) counterEl.textContent = (index + 1) + ' / ' + total;
    }
    prevBtn.addEventListener('click', function () { goTo(index - 1); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); });
    goTo(0);
  }

  function init() {
    initForms();
    initBurger();
    initSmoothScroll();
    initReveal();
    initHeroVideo();
    initScrollTop();
    initCasesCarousel();
    document.body.classList.add('reveal-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
