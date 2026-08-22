<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="WEB-INF/tariff.jspf" %>
<%
    // bill.jsp sends the reading back here on a bad entry, so the field
    // can be re-filled instead of making the user type it again.
    String entered = esc(request.getParameter("units"));
    String notice  = esc(request.getParameter("notice"));
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="description" content="Slab-wise domestic electricity bill calculator built with JSP.">
<title>Electricity Bill Calculator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<a class="skip" href="#calculator">Skip to the calculator</a>

<div class="shell">

  <header class="topbar">
    <span class="brand"><span class="brand__mark" aria-hidden="true"></span>Powergrid&nbsp;Billing</span>
    <span class="topbar__tag">Domestic &middot; single phase</span>
  </header>

  <main>

    <section class="masthead">
      <p class="eyebrow">Slab tariff &middot; JSP</p>
      <h1>Electricity<br><span class="thin">bill calculator</span></h1>
      <p class="lede">Enter the units on your meter. Every slab is charged only
         on the units that fall inside it, so the first 50 units always stay cheap
         no matter how large the reading gets.</p>
    </section>

<% if (!notice.isEmpty()) { %>
    <p class="notice" role="status"><%= notice %></p>
<% } %>

    <form class="card meter" id="calculator" action="bill.jsp" method="post" novalidate>
      <label class="field-label" for="units">Units consumed this month</label>

      <div class="lcd">
        <input class="lcd__input" type="number" inputmode="numeric" id="units" name="units"
               min="0" max="<%= MAX_UNITS %>" step="1" placeholder="0"
               value="<%= entered %>" required autofocus
               aria-describedby="hint">
        <span class="lcd__unit" aria-hidden="true">kWh</span>
      </div>

      <input class="slider" type="range" id="slider" min="0" max="500" step="1"
             value="0" aria-label="Drag to set the units, 0 to 500">

      <p class="hint" id="hint">Whole units only, up to <%= String.format("%,d", MAX_UNITS) %>.
         The slider covers the first 500 &mdash; type larger readings straight into the box.</p>

      <output class="preview" id="preview" for="units slider" hidden>
        <span class="preview__label">Running estimate</span>
        <span class="preview__value" id="previewValue"><%= RUPEE %>&nbsp;0.00</span>
        <span class="preview__bar" id="previewBar" aria-hidden="true"></span>
      </output>

      <button class="calc" type="submit">Calculate bill</button>
      <p class="foot-note">Submitting recalculates the bill on the server in
         <code>bill.jsp</code>; the running estimate above is only a preview.</p>
    </form>

    <section class="card tariff" aria-labelledby="tariff-title">
      <h2 id="tariff-title" class="card__title">Rate slabs</h2>

      <ul class="tariff__list">
<%      for (int i = 0; i < SLAB_SIZE.length; i++) { %>
        <li class="slab" style="--slab:<%= SLAB_COLOR[i] %>">
          <span class="slab__chip" aria-hidden="true"></span>
          <span class="slab__name"><%= SLAB_NAME[i] %>
            <em><%= SLAB_RANGE[i] %></em>
          </span>
          <span class="slab__rate"><%= RUPEE %>&nbsp;<%= money(SLAB_RATE[i]) %><small>/unit</small></span>
        </li>
<%      } %>
      </ul>

      <p class="card__note">A 300 unit reading is billed as
         50 &times; <%= RUPEE %>3.50 + 100 &times; <%= RUPEE %>4.00 + 100 &times; <%= RUPEE %>5.20 +
         50 &times; <%= RUPEE %>6.50, not 300 &times; <%= RUPEE %>6.50.</p>
    </section>

  </main>

  <footer class="pagefoot">
    <p>Web Technology &middot; Assignment 4 &middot; JSP</p>
  </footer>

</div>

<script>window.TARIFF = <%= tariffJson() %>;</script>
<script src="script.js" defer></script>
</body>
</html>
