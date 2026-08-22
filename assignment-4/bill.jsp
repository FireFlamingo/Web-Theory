<%@ page contentType="text/html;charset=UTF-8" language="java"
         trimDirectiveWhitespaces="true" %>
<%@ page import="java.net.URLEncoder" %>
<%@ include file="WEB-INF/tariff.jspf" %>
<%
    request.setCharacterEncoding("UTF-8");

    String raw   = request.getParameter("units");
    int    units = readUnits(raw);

    // Nothing usable came in: hand the reading back to the form with a reason.
    if (units < 0) {
        String reason = (raw == null || raw.trim().isEmpty())
                ? "Enter the units on your meter to calculate a bill."
                : "\"" + raw.trim() + "\" is not a usable reading. Use a whole number between 0 and "
                  + String.format("%,d", MAX_UNITS) + ".";
        response.sendRedirect("index.jsp?notice=" + URLEncoder.encode(reason, "UTF-8")
                + "&units=" + URLEncoder.encode(raw == null ? "" : raw.trim(), "UTF-8"));
        return;
    }

    int[]    slabUnits  = new int[SLAB_SIZE.length];
    double[] slabAmount = new double[SLAB_SIZE.length];
    double   total      = splitBill(units, slabUnits, slabAmount);
    double   average    = (units > 0) ? total / units : 0.0;

    // Units still available inside the slab the reading currently sits in.
    int filled = 0, headroom = 0;
    String currentSlab = SLAB_NAME[0];
    for (int i = 0; i < SLAB_SIZE.length; i++) {
        if (SLAB_SIZE[i] == Integer.MAX_VALUE) { currentSlab = SLAB_NAME[i]; headroom = -1; break; }
        filled += SLAB_SIZE[i];
        if (units <= filled) { currentSlab = SLAB_NAME[i]; headroom = filled - units; break; }
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Bill for <%= units %> units &middot; Electricity Bill Calculator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="shell">

  <header class="topbar">
    <span class="brand"><span class="brand__mark" aria-hidden="true"></span>Powergrid&nbsp;Billing</span>
    <span class="topbar__tag">Statement</span>
  </header>

  <main>

    <section class="masthead">
      <p class="eyebrow">Bill statement &middot; <%= String.format("%,d", units) %> kWh</p>
      <h1><%= String.format("%,d", units) %> units<br><span class="thin">consumed</span></h1>
    </section>

    <section class="total">
      <p class="total__label">Amount payable</p>
      <div class="total__amount"><%= RUPEE %>&nbsp;<%= money(total) %></div>
<%    if (units > 0) { %>
      <p class="total__sub">That works out to <%= RUPEE %>&nbsp;<%= money(average) %> per unit
         across <%= String.format("%,d", units) %> units.</p>
<%    } else { %>
      <p class="total__sub">No units were recorded this month, so nothing is charged.</p>
<%    } %>
    </section>

<%  if (units > 0) { %>
    <section class="mix" aria-labelledby="mix-title">
      <h2 id="mix-title" class="card__title">How the units were split</h2>

      <div class="stack" role="img"
           aria-label="Share of the <%= units %> units falling in each rate slab">
<%      for (int i = 0; i < slabUnits.length; i++) {
            if (slabUnits[i] == 0) continue;
            double pct = slabUnits[i] * 100.0 / units; %>
        <span class="stack__seg"
              style="width:<%= String.format("%.4f", pct) %>%;background:<%= SLAB_COLOR[i] %>"
              title="<%= SLAB_NAME[i] %>: <%= slabUnits[i] %> units"></span>
<%      } %>
      </div>

      <ul class="legend">
<%      for (int i = 0; i < slabUnits.length; i++) {
            if (slabUnits[i] == 0) continue; %>
        <li style="--slab:<%= SLAB_COLOR[i] %>">
          <span class="legend__chip" aria-hidden="true"></span>
          <%= slabUnits[i] %> at <%= RUPEE %><%= money(SLAB_RATE[i]) %>
        </li>
<%      } %>
      </ul>
    </section>
<%  } %>

    <section class="card" aria-labelledby="break-title">
      <h2 id="break-title" class="card__title">Slab-wise breakdown</h2>

      <table class="breakdown">
        <thead>
          <tr>
            <th scope="col">Slab</th>
            <th scope="col" class="num">Rate</th>
            <th scope="col" class="num">Units</th>
            <th scope="col" class="num">Amount</th>
          </tr>
        </thead>
        <tbody>
<%      for (int i = 0; i < SLAB_SIZE.length; i++) { %>
          <tr<%= slabUnits[i] == 0 ? " class=\"unused\"" : "" %> style="--slab:<%= SLAB_COLOR[i] %>">
            <td data-label="Slab">
              <span class="name"><span class="dot" aria-hidden="true"></span>
                <span><%= SLAB_NAME[i] %><em><%= SLAB_RANGE[i] %></em></span>
              </span>
            </td>
            <td data-label="Rate"   class="num"><%= RUPEE %>&nbsp;<%= money(SLAB_RATE[i]) %></td>
            <td data-label="Units"  class="num"><%= slabUnits[i] %></td>
            <td data-label="Amount" class="num"><%= RUPEE %>&nbsp;<%= money(slabAmount[i]) %></td>
          </tr>
<%      } %>
        </tbody>
        <tfoot>
          <tr>
            <td data-label="Total">Total</td>
            <td class="num"></td>
            <td data-label="Units"  class="num"><%= String.format("%,d", units) %></td>
            <td data-label="Amount" class="num"><%= RUPEE %>&nbsp;<%= money(total) %></td>
          </tr>
        </tfoot>
      </table>

<%    if (units > 0 && headroom > 0) { %>
      <p class="card__note">This reading sits in the <strong><%= currentSlab.toLowerCase() %></strong>
         band &mdash; <%= headroom %> more unit<%= headroom == 1 ? "" : "s" %> before the next,
         dearer slab starts.</p>
<%    } else if (units > 250) { %>
      <p class="card__note">Everything past 250 units is billed at the top rate of
         <%= RUPEE %>&nbsp;<%= money(SLAB_RATE[SLAB_SIZE.length - 1]) %> per unit.</p>
<%    } %>
    </section>

    <form class="card again" action="bill.jsp" method="post">
      <label class="field-label" for="units">Try another reading</label>
      <div class="again__row">
        <input class="again__input" type="number" inputmode="numeric" id="units" name="units"
               min="0" max="<%= MAX_UNITS %>" step="1" value="<%= units %>" required>
        <button class="calc calc--inline" type="submit">Recalculate</button>
      </div>
    </form>

    <p class="actions">
      <a class="back" href="index.jsp">Back to the calculator</a>
      <button class="ghost" type="button" onclick="window.print()">Print this bill</button>
    </p>

  </main>

  <footer class="pagefoot">
    <p>Web Technology &middot; Assignment 4 &middot; JSP</p>
  </footer>

</div>

</body>
</html>
