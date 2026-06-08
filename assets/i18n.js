/*
 * i18n.js — michelstorms.com
 *
 * Lightweight client-side localization for a static GitHub Pages site.
 *
 * Languages: en (default / source), nl, fr.
 *
 * Region/language detection (first visit only):
 *   navigator.language(s):
 *     nl-BE (Vlaanderen) / nl-NL (Holland) / nl  -> Dutch
 *     fr-BE (Wallonie)   / fr-FR (France)   / fr  -> French
 *     everything else                             -> English
 *   A manual choice via the EN·NL·FR switcher is stored in localStorage
 *   and always wins on later visits.
 *
 * Per-page usage: define window.I18N_STRINGS = { nl: {...}, fr: {...} }
 * BEFORE this script loads, and tag elements:
 *   <h1 data-i18n="hero.title">English text here</h1>
 *   <meta name="description" data-i18n-attr="content:meta.desc">
 * English is read straight from the HTML (no `en` dictionary needed).
 * Put data-i18n only on elements whose text is "leaf" (no nested
 * data-i18n inside); translation values may contain inline HTML.
 */
(function () {
  var SUPPORTED = ['en', 'nl', 'fr'];
  var STORE_KEY = 'site-lang';
  var LABELS = [['en', 'EN'], ['nl', 'NL'], ['fr', 'FR']];

  function strings() { return window.I18N_STRINGS || {}; }

  function detect() {
    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (saved && SUPPORTED.indexOf(saved) > -1) return saved;
    } catch (e) {}
    var list = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var l = (list[i] || '').toLowerCase();
      if (l.indexOf('nl') === 0) return 'nl';
      if (l.indexOf('fr') === 0) return 'fr';
      if (l.indexOf('en') === 0) return 'en';
    }
    return 'en';
  }

  var current = detect();

  function capture() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].__en == null) nodes[i].__en = nodes[i].innerHTML;
    }
    var attrNodes = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      var el = attrNodes[j];
      if (el.__enAttr) continue;
      el.__enAttr = {};
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var a = pair.split(':')[0];
        if (a && a.trim()) el.__enAttr[a.trim()] = el.getAttribute(a.trim());
      });
    }
  }

  function apply(lang) {
    var dict = strings()[lang] || {};
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var k = el.getAttribute('data-i18n');
      var val = (lang === 'en' || dict[k] == null) ? el.__en : dict[k];
      // Plain strings go through textContent (no HTML parsing); only values
      // that actually contain markup or entities use innerHTML. Keeps the
      // injection surface minimal even though all values are author-authored.
      if (/[<&]/.test(val)) el.innerHTML = val; else el.textContent = val;
    }
    var attrNodes = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      (function (el) {
        el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
          var parts = pair.split(':');
          var a = (parts[0] || '').trim();
          var key = (parts[1] || '').trim();
          if (!a || !key) return;
          var v = (lang === 'en' || dict[key] == null) ? el.__enAttr[a] : dict[key];
          if (v != null) el.setAttribute(a, v);
        });
      })(attrNodes[j]);
    }
    document.documentElement.lang = lang;
    var btns = document.querySelectorAll('.lang-switch button');
    for (var b = 0; b < btns.length; b++) {
      btns[b].setAttribute('aria-current', btns[b].getAttribute('data-lang') === lang ? 'true' : 'false');
    }
  }

  function setLang(lang) {
    current = lang;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    apply(lang);
  }

  function injectStyles() {
    if (document.getElementById('lang-switch-style')) return;
    var css =
      '.nav-inner .nav-logo{margin-right:auto;}' +
      '.lang-switch{display:inline-flex;align-items:center;border:1px solid var(--gray-200,#e2e2e7);' +
      'border-radius:8px;overflow:hidden;background:rgba(255,255,255,.6);margin-left:20px;flex-shrink:0;}' +
      '.lang-switch button{font-family:inherit;font-size:.72rem;font-weight:600;letter-spacing:.04em;' +
      'text-transform:uppercase;color:var(--gray-500,#52525a);background:none;border:none;' +
      'padding:6px 9px;cursor:pointer;line-height:1;transition:background .15s,color .15s;}' +
      '.lang-switch button + button{border-left:1px solid var(--gray-200,#e2e2e7);}' +
      '.lang-switch button:hover{color:var(--navy,#2d2e3a);}' +
      '.lang-switch button[aria-current="true"]{background:var(--navy,#2d2e3a);color:#fff;}' +
      // Auto mobile menu for pages that have no hamburger of their own.
      '.i18n-auto-nav .i18n-nav-toggle{display:none;background:none;border:none;cursor:pointer;padding:8px;margin-left:14px;flex-shrink:0;}' +
      '.i18n-auto-nav .i18n-nav-toggle span{display:block;width:22px;height:2px;background:var(--navy,#2d2e3a);margin:5px 0;border-radius:2px;}' +
      '@media (max-width:768px){.lang-switch{margin-left:14px;}' +
      '.i18n-auto-nav .nav-links{display:none;}' +
      '.i18n-auto-nav .nav-links.open{display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;' +
      'background:var(--white,#fff);padding:24px;gap:20px;border-bottom:1px solid var(--gray-200,#e2e2e7);' +
      'box-shadow:0 4px 20px rgba(0,0,0,.06);}' +
      '.i18n-auto-nav .i18n-nav-toggle{display:block;}}' +
      // Compact the nav on small phones so logo + menu + switcher never overflow.
      '@media (max-width:480px){.nav-inner .nav-logo{font-size:1.2rem;}' +
      '.lang-switch{margin-left:10px;}.lang-switch button{padding:6px 7px;font-size:.68rem;}' +
      '.i18n-auto-nav .i18n-nav-toggle{margin-left:8px;padding:8px 2px;}}';
    var style = document.createElement('style');
    style.id = 'lang-switch-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildSwitch() {
    var nav = document.querySelector('.nav-inner');
    if (!nav || nav.querySelector('.lang-switch')) return;

    // Pages without their own hamburger (apps gallery, app landing pages) keep
    // their nav links inline, which overflows on phones. Inject a hamburger and
    // a collapsible dropdown — same pattern the homepage uses — so every page has
    // a consistent mobile menu. The toggle goes in before the switcher so the
    // switcher stays rightmost.
    var links = nav.querySelector('.nav-links');
    if (links && !nav.querySelector('.nav-toggle') && !nav.querySelector('.i18n-nav-toggle')) {
      nav.classList.add('i18n-auto-nav');
      var tg = document.createElement('button');
      tg.type = 'button';
      tg.className = 'i18n-nav-toggle';
      tg.setAttribute('aria-label', 'Menu');
      tg.setAttribute('aria-expanded', 'false');
      tg.innerHTML = '<span></span><span></span><span></span>';
      tg.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        tg.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      links.addEventListener('click', function (e) {
        if (e.target && e.target.tagName === 'A') {
          links.classList.remove('open');
          tg.setAttribute('aria-expanded', 'false');
        }
      });
      nav.appendChild(tg);
    }

    var box = document.createElement('div');
    box.className = 'lang-switch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Language');
    LABELS.forEach(function (p) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-lang', p[0]);
      btn.setAttribute('aria-label', p[1]);
      btn.textContent = p[1];
      btn.addEventListener('click', function () { setLang(p[0]); });
      box.appendChild(btn);
    });
    // Always last child of the nav so the switcher sits rightmost,
    // regardless of whether the hamburger or nav-links come first in markup.
    nav.appendChild(box);
  }

  function init() {
    injectStyles();
    capture();
    buildSwitch();
    apply(current);
    // Reveal the page once translations are applied (see the in-<head> cloak
    // snippet that hides non-English first paint to avoid a flash of English).
    document.documentElement.removeAttribute('data-i18n-cloak');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
