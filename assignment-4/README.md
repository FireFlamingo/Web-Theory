# Assignment 4 — Electricity Bill Calculator (JSP)

A responsive website that calculates a domestic electricity bill from a slab
tariff. Assignment 3 solved the same problem with a servlet that printed HTML
from `PrintWriter`; this version is pure **JSP** — the same interface, but the
markup is written as markup with the Java sitting inside it.

The stylesheet is assignment 3's, unchanged, so the two look identical.

## Tariff

| Slab            | Range         | Rate per unit |
| --------------- | ------------- | ------------- |
| First 50 units  | 1 – 50        | ₹ 3.50        |
| Next 100 units  | 51 – 150      | ₹ 4.00        |
| Next 100 units  | 151 – 250     | ₹ 5.20        |
| Above 250 units | 251 and above | ₹ 6.50        |

Slabs are cumulative: each rate applies only to the units that fall inside its
own band. A 300 unit reading is billed as
`50×3.50 + 100×4.00 + 100×5.20 + 50×6.50 = ₹1420.00`, **not** `300×6.50`.

## Files

```
assignment-4/
├── index.jsp              the form and the tariff card
├── bill.jsp               validates the reading, calculates, renders the statement
├── style.css              assignment 3's stylesheet, unchanged
├── WEB-INF/
│   ├── tariff.jspf        the slab table and the bill maths — included by both pages
│   └── web.xml            welcome file + session timeout (optional on Tomcat)
└── README.md
```

`tariff.jspf` is pulled into both pages with the static include directive:

```jsp
<%@ include file="WEB-INF/tariff.jspf" %>
```

It holds the rates, the slab labels, the colours, `splitBill()`, `money()` and
`readUnits()`. Changing a rate there updates the tariff card and the bill in one
edit — nothing is written down twice. This is what replaces the constant arrays
that sat at the top of `BillServlet.java` in assignment 3.

## What changed from assignment 3

| | Assignment 3 | Assignment 4 |
| --- | --- | --- |
| Technology | Servlet (`BillServlet.java`) | JSP (`index.jsp`, `bill.jsp`) |
| Form page | static `index.html` | `index.jsp`, tariff card printed by a loop |
| Result page | `out.println("<table>…")` | real HTML with `<%= %>` in it |
| Build step | compile the servlet | none — the container compiles the JSPs |
| Server portability | `javax.servlet` imports had to be swapped for Jakarta | nothing to swap; the JSPs import no servlet classes |

## Running it

Needs a servlet container. Tomcat 9 or 10 both work as-is.

**Tomcat, by hand**

1. Copy the `assignment-4` folder into `<tomcat>/webapps/` (rename it if you
   like — the folder name becomes the context path).
2. Start Tomcat: `bin\startup.bat` on Windows, `bin/startup.sh` elsewhere.
3. Open <http://localhost:8080/assignment-4/>.

**NetBeans / Eclipse**

Create a Java Web application, then drop `index.jsp`, `bill.jsp` and `style.css`
into *Web Pages*, and `tariff.jspf` and `web.xml` into *Web Pages / WEB-INF*.
Run the project.

Nothing needs compiling first — there are no `.java` files, and the JSPs import
nothing from `javax.servlet`, so the same source runs unchanged on Jakarta EE
servers (Tomcat 10+). Only `web.xml` carries a version-specific namespace, and
that file is optional; the comment at the top of it shows the Jakarta swap.

## How a request flows

1. `index.jsp` renders the form and prints the four slab rows from the arrays in
   `tariff.jspf`.
2. The form POSTs `units` to `bill.jsp`.
3. `bill.jsp` calls `readUnits()`. A missing parameter redirects back to the
   form; anything that is not a whole number in 0 … 100000 renders the
   "reading not accepted" page.
4. A valid reading goes through `splitBill()`, which walks the slabs cheapest
   first and returns the total alongside the per-slab units and amounts.
5. The statement renders: amount payable, effective rate per unit, a stacked bar
   showing how the units divided across the slabs, and the four-row breakdown
   table with a total.

`bill.jsp` answers GET as well as POST, so `bill.jsp?units=300` can be typed
straight into the address bar while testing.

## Responsive behaviour

Inherited from assignment 3's stylesheet and unchanged.

- One column throughout, capped at a 660px measure and centred.
- Type scales fluidly with `clamp()` rather than jumping at breakpoints, so the
  large readout stays readable on a phone and never overflows.
- Below 460px the breakdown table drops its Rate column, since the rate is
  already listed on the tariff card.
- `prefers-reduced-motion` switches the transitions off.

## Notes

- **Validation is server-side.** The `type="number"` field only helps; `bill.jsp`
  re-checks the reading regardless of what the browser sent.
- **No JavaScript.** The page works with scripting switched off.

## Worked examples

| Units  | Working                                    | Bill        |
| ------ | ------------------------------------------ | ----------- |
| 0      | nothing consumed                           | ₹ 0.00      |
| 50     | 50×3.50                                    | ₹ 175.00    |
| 120    | 50×3.50 + 70×4.00                          | ₹ 455.00    |
| 200    | 50×3.50 + 100×4.00 + 50×5.20               | ₹ 835.00    |
| 250    | 50×3.50 + 100×4.00 + 100×5.20              | ₹ 1095.00   |
| 300    | 50×3.50 + 100×4.00 + 100×5.20 + 50×6.50    | ₹ 1420.00   |
| 1000   | 50×3.50 + 100×4.00 + 100×5.20 + 750×6.50   | ₹ 5970.00   |
