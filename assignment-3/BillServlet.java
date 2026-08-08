package bill;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Electricity bill calculator.
 *
 * Slab tariff:
 *   first 50 units      -> Rs. 3.50 / unit
 *   next  100 units     -> Rs. 4.00 / unit   (51 - 150)
 *   next  100 units     -> Rs. 5.20 / unit   (151 - 250)
 *   above 250 units     -> Rs. 6.50 / unit
 *
 * NOTE ON IMPORTS: this file uses javax.servlet.* (Tomcat 9 / GlassFish 5,
 * i.e. Java EE 8). If your server is Tomcat 10+ or GlassFish 6+ (Jakarta EE 9+),
 * change every "javax.servlet" above to "jakarta.servlet".
 */
@WebServlet(name = "BillServlet", urlPatterns = {"/BillServlet"})
public class BillServlet extends HttpServlet {

    /** Number of units each slab can absorb; the last slab is unbounded. */
    private static final int[] SLAB_SIZE  = {50, 100, 100, Integer.MAX_VALUE};
    private static final double[] SLAB_RATE = {3.50, 4.00, 5.20, 6.50};
    private static final String[] SLAB_NAME = {
        "First 50 units", "Next 100 units", "Next 100 units", "Above 250 units"
    };
    private static final String[] SLAB_COLOR = {"#2F6B6B", "#6A8C4F", "#B58B2E", "#C64B2A"};

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        int units;
        try {
            units = Integer.parseInt(request.getParameter("units").trim());
            if (units < 0) {
                throw new NumberFormatException("negative");
            }
        } catch (Exception e) {
            writeError(out, "Enter the units as a whole number of 0 or more, then calculate again.");
            out.close();
            return;
        }

        // ---- slab-wise calculation -------------------------------------
        int[] slabUnits = new int[SLAB_SIZE.length];
        double[] slabAmount = new double[SLAB_SIZE.length];
        double total = 0.0;

        int remaining = units;
        for (int i = 0; i < SLAB_SIZE.length && remaining > 0; i++) {
            int used = Math.min(remaining, SLAB_SIZE[i]);
            slabUnits[i] = used;
            slabAmount[i] = used * SLAB_RATE[i];
            total += slabAmount[i];
            remaining -= used;
        }

        double average = (units > 0) ? total / units : 0.0;

        // ---- result page -----------------------------------------------
        out.println("<!DOCTYPE html>");
        out.println("<html lang='en'><head><meta charset='UTF-8'>");
        out.println("<meta name='viewport' content='width=device-width, initial-scale=1'>");
        out.println("<title>Bill for " + units + " units</title>");
        out.println("<link rel='preconnect' href='https://fonts.googleapis.com'>");
        out.println("<link href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700"
                + "&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500&display=swap' rel='stylesheet'>");
        out.println("<link rel='stylesheet' href='style.css'>");
        out.println("</head><body><main class='sheet'>");

        out.println("<header class='masthead'>");
        out.println("<p class='eyebrow'>Bill statement</p>");
        out.println("<h1>" + units + " units<br><span class='thin'>consumed</span></h1>");
        out.println("</header>");

        out.println("<section class='total'>");
        out.println("<p class='total__label'>Amount payable</p>");
        out.println("<div class='total__amount'>&#8377; " + money(total) + "</div>");
        if (units > 0) {
            out.println("<p class='total__sub'>Effective rate &#8377; " + money(average)
                    + " per unit across " + units + " units.</p>");
        } else {
            out.println("<p class='total__sub'>No units recorded, so nothing is charged.</p>");
        }
        out.println("</section>");

        // stacked bar: each segment is one slab's share of the units
        if (units > 0) {
            out.println("<div class='stack' role='img' aria-label='Share of units in each rate slab'>");
            for (int i = 0; i < slabUnits.length; i++) {
                if (slabUnits[i] > 0) {
                    double pct = slabUnits[i] * 100.0 / units;
                    out.println("<span class='stack__seg' style=\"width:" + String.format("%.4f", pct)
                            + "%;background:" + SLAB_COLOR[i] + "\"></span>");
                }
            }
            out.println("</div>");
        }

        out.println("<table class='breakdown'>");
        out.println("<thead><tr><th>Slab</th><th class='num'>Rate</th>"
                + "<th class='num'>Units</th><th class='num'>Amount</th></tr></thead>");
        out.println("<tbody>");
        for (int i = 0; i < SLAB_SIZE.length; i++) {
            String cls = (slabUnits[i] == 0) ? " class='unused'" : "";
            out.println("<tr" + cls + " style=\"--slab:" + SLAB_COLOR[i] + "\">");
            out.println("<td><span class='name'><span class='dot'></span>" + SLAB_NAME[i] + "</span></td>");
            out.println("<td class='num'>&#8377; " + money(SLAB_RATE[i]) + "</td>");
            out.println("<td class='num'>" + slabUnits[i] + "</td>");
            out.println("<td class='num'>&#8377; " + money(slabAmount[i]) + "</td>");
            out.println("</tr>");
        }
        out.println("</tbody>");
        out.println("<tfoot><tr><td>Total</td><td class='num'></td><td class='num'>" + units
                + "</td><td class='num'>&#8377; " + money(total) + "</td></tr></tfoot>");
        out.println("</table>");

        out.println("<a class='back' href='index.html'>Calculate another bill</a>");
        out.println("</main></body></html>");
        out.close();
    }

    /** Allow the page to be reached by GET too (e.g. BillServlet?units=180). */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if (request.getParameter("units") == null) {
            response.sendRedirect("index.html");
        } else {
            doPost(request, response);
        }
    }

    private void writeError(PrintWriter out, String message) {
        out.println("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>");
        out.println("<meta name='viewport' content='width=device-width, initial-scale=1'>");
        out.println("<title>Check the units</title>");
        out.println("<link rel='stylesheet' href='style.css'></head><body><main class='sheet'>");
        out.println("<header class='masthead'><p class='eyebrow'>Bill statement</p>"
                + "<h1>Reading<br><span class='thin'>not accepted</span></h1></header>");
        out.println("<div class='error'><p>" + message + "</p></div>");
        out.println("<a class='back' href='index.html'>Back to the calculator</a>");
        out.println("</main></body></html>");
    }

    private String money(double value) {
        return String.format("%.2f", value);
    }

    @Override
    public String getServletInfo() {
        return "Slab-wise electricity bill calculator";
    }
}
