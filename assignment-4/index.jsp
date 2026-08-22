<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="WEB-INF/tariff.jspf" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Electricity Bill Calculator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<main class="sheet">

  <header class="masthead">
    <p class="eyebrow">Domestic supply &middot; slab tariff</p>
    <h1>Electricity<br><span class="thin">bill calculator</span></h1>
  </header>

  <form class="meter" action="bill.jsp" method="post">
    <label class="meter__label" for="units">Units consumed this month</label>

    <div class="lcd">
      <input class="lcd__input" type="number" id="units" name="units"
             min="0" max="<%= MAX_UNITS %>" step="1" placeholder="0" required autofocus>
      <span class="lcd__unit">kWh</span>
    </div>

    <p class="hint" id="hint">Whole units only. Enter 0 to see the minimum bill.</p>

    <button class="calc" type="submit">Calculate bill</button>
  </form>

  <section class="tariff" aria-labelledby="tariff-title">
    <h2 id="tariff-title" class="tariff__title">Rate slabs</h2>
    <ul class="tariff__list">
<%  for (int i = 0; i < SLAB_SIZE.length; i++) { %>
      <li class="slab" style="--slab:<%= SLAB_COLOR[i] %>">
        <span class="slab__chip" aria-hidden="true"></span>
        <span class="slab__range"><%= SLAB_NAME[i] %><%= SLAB_RANGE[i].isEmpty() ? "" : " <em>" + SLAB_RANGE[i] + "</em>" %></span>
        <span class="slab__rate">&#8377; <%= money(SLAB_RATE[i]) %></span>
      </li>
<%  } %>
    </ul>
    <p class="tariff__note">Each slab is charged only on the units that fall inside it, so the rate rises as consumption grows.</p>
  </section>

</main>

</body>
</html>
