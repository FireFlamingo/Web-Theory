<%@ page contentType="text/html;charset=UTF-8" language="java"
         trimDirectiveWhitespaces="true" %>
<%@ include file="WEB-INF/tariff.jspf" %>
<%
    request.setCharacterEncoding("UTF-8");

    String raw = request.getParameter("units");

    // Reached with no reading at all (e.g. someone typed the URL): go back.
    if (raw == null) {
        response.sendRedirect("index.jsp");
        return;
    }

    int units = readUnits(raw);
%>
<%  if (units < 0) {   /* ---------- the reading could not be used ---------- */ %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Check the units</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<main class="sheet">

  <header class="masthead">
    <p class="eyebrow">Bill statement</p>
    <h1>Reading<br><span class="thin">not accepted</span></h1>
  </header>

  <div class="error">
    <p>Enter the units as a whole number between 0 and <%= MAX_UNITS %>, then calculate again.</p>
  </div>

  <a class="back" href="index.jsp">Back to the calculator</a>

</main>

</body>
</html>
<%  return;
    }

    /* ---------- slab-wise calculation ---------- */
    int[]    slabUnits  = new int[SLAB_SIZE.length];
    double[] slabAmount = new double[SLAB_SIZE.length];
    double   total      = splitBill(units, slabUnits, slabAmount);
    double   average    = (units > 0) ? total / units : 0.0;
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bill for <%= units %> units</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<main class="sheet">

  <header class="masthead">
    <p class="eyebrow">Bill statement</p>
    <h1><%= units %> units<br><span class="thin">consumed</span></h1>
  </header>

  <section class="total">
    <p class="total__label">Amount payable</p>
    <div class="total__amount">&#8377; <%= money(total) %></div>
<%  if (units > 0) { %>
    <p class="total__sub">Effective rate &#8377; <%= money(average) %> per unit across <%= units %> units.</p>
<%  } else { %>
    <p class="total__sub">No units recorded, so nothing is charged.</p>
<%  } %>
  </section>

<%  if (units > 0) {   /* stacked bar: each segment is one slab's share of the units */ %>
  <div class="stack" role="img" aria-label="Share of units in each rate slab">
<%      for (int i = 0; i < slabUnits.length; i++) {
            if (slabUnits[i] == 0) continue;
            double pct = slabUnits[i] * 100.0 / units; %>
    <span class="stack__seg" style="width:<%= String.format("%.4f", pct) %>%;background:<%= SLAB_COLOR[i] %>"></span>
<%      } %>
  </div>
<%  } %>

  <table class="breakdown">
    <thead>
      <tr><th>Slab</th><th class="num">Rate</th><th class="num">Units</th><th class="num">Amount</th></tr>
    </thead>
    <tbody>
<%  for (int i = 0; i < SLAB_SIZE.length; i++) { %>
      <tr<%= slabUnits[i] == 0 ? " class=\"unused\"" : "" %> style="--slab:<%= SLAB_COLOR[i] %>">
        <td><span class="name"><span class="dot"></span><%= SLAB_NAME[i] %></span></td>
        <td class="num">&#8377; <%= money(SLAB_RATE[i]) %></td>
        <td class="num"><%= slabUnits[i] %></td>
        <td class="num">&#8377; <%= money(slabAmount[i]) %></td>
      </tr>
<%  } %>
    </tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td class="num"></td>
        <td class="num"><%= units %></td>
        <td class="num">&#8377; <%= money(total) %></td>
      </tr>
    </tfoot>
  </table>

  <a class="back" href="index.jsp">Calculate another bill</a>

</main>

</body>
</html>
