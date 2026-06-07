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
      el.innerHTML = (lang === 'en' || dict[k] == null) ? el.__en : dict[k];
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
      '@media (max-width:768px){.lang-switch{margin-left:auto;margin-right:14px;}}';
    var style = document.createElement('style');
    style.id = 'lang-switch-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildSwitch() {
    var nav = document.querySelector('.nav-inner');
    if (!nav || nav.querySelector('.lang-switch')) return;
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
    var toggle = nav.querySelector('.nav-toggle');
    if (toggle) nav.insertBefore(box, toggle);
    else nav.appendChild(box);
  }

  function init() {
    injectStyles();
    capture();
    buildSwitch();
    apply(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
