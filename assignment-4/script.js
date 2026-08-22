/*
 * script.js - progressive enhancement for index.jsp.
 *
 * The page works with JavaScript switched off: the form posts to bill.jsp and
 * the server does the sums. This file only adds a slider and a running estimate
 * on top of that. The slab table it uses (window.TARIFF) is printed by the JSP
 * from the same arrays the server bills with, so the preview cannot drift.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var slabs   = window.TARIFF || [];
  var units   = document.getElementById('units');
  var slider  = document.getElementById('slider');
  var preview = document.getElementById('preview');
  var value   = document.getElementById('previewValue');
  var bar     = document.getElementById('previewBar');

  if (!units || !slabs.length) return;

  var money = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  /* Same walk as splitBill() in tariff.jspf: fill each slab in turn. */
  function split(n) {
    var parts = [];
    var total = 0;
    var left  = n;

    slabs.forEach(function (slab) {
      var size = slab.size === null ? Infinity : slab.size;
      var used = Math.min(Math.max(left, 0), size);
      parts.push({ units: used, color: slab.color });
      total += used * slab.rate;
      left  -= used;
    });

    return { parts: parts, total: total };
  }

  function read() {
    var n = parseInt(units.value, 10);
    var max = Number(units.max) || Infinity;
    if (isNaN(n) || n < 0 || n > max) return null;   /* same range bill.jsp accepts */
    return n;
  }

  function render() {
    var n = read();

    if (n === null) {
      preview.hidden = true;
      return;
    }

    var result = split(n);
    preview.hidden = false;
    value.textContent = '₹ ' + money.format(result.total);   /* rupee + nbsp */

    bar.innerHTML = '';
    result.parts.forEach(function (part) {
      if (!part.units || !n) return;
      var seg = document.createElement('span');
      seg.style.width = (part.units * 100 / n) + '%';
      seg.style.background = part.color;
      bar.appendChild(seg);
    });
  }

  units.addEventListener('input', function () {
    var n = read();
    if (slider && n !== null && n <= Number(slider.max)) slider.value = n;
    render();
  });

  if (slider) {
    slider.value = read() || 0;
    slider.addEventListener('input', function () {
      units.value = slider.value;
      render();
    });
  }

  render();
})();
