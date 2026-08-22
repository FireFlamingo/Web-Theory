# Assignment 4 — Electricity Bill Calculator (JSP)

A responsive website that calculates a domestic electricity bill from a slab
tariff. Assignment 3 solved the same problem with a servlet that printed HTML
from `PrintWriter`; this version is pure **JSP** — the markup is written as
markup, and the Java sits inside it.

## Tariff

| Slab            | Range         | Rate per unit |
| --------------- | ------------- | ------------- |
| First 50 units  | 1 – 50        | ₹ 3.50        |
| Next 100 units  | 51 – 150      | ₹ 4.00        |
| Next 100 units  | 151 – 250     | ₹ 5.20        |
| Above 250 units | 251 and above | ₹ 6.50        |

Slabs are cumulative: each rate applies only to the units that fall inside its
own band. A 300 unit reading is billed as
`50×3.50 + 100×4.00 + 100×5.20 + 50×6.50 = ₹1,420.00`, **not** `300×6.50`.

## Files

```
assignment-4/
├── index.jsp              form, live estimate, tariff card
├── bill.jsp               validates the reading, calculates, renders the statement
├── style.css              shared responsive stylesheet (light + dark)
├── script.js              slider and running estimate (optional enhancement)
├── WEB-INF/
│   ├── tariff.jspf        the slab table and the bill maths — included by both pages
│   └── web.xml            welcome file + session timeout (optional on Tomcat)
└── README.md
```

`tariff.jspf` is pulled into both pages with the static include directive:

```jsp
<%@ include file="WEB-INF/tariff.jspf" %>
```

It holds the rates, the slab labels, the colours, `splitBill()`, `money()`,
`esc()` and `readUnits()`. Changing a rate there updates the tariff card, the
JavaScript preview and the server-side bill in one edit — nothing is written
down twice.

## Running it

Needs a servlet container. Tomcat 9 or 10 both work as-is.

**Tomcat, by hand**

1. Copy the `assignment-4` folder into `<tomcat>/webapps/` (rename it if you
   like — the folder name becomes the context path).
2. Start Tomcat: `bin\startup.bat` on Windows, `bin/startup.sh` elsewhere.
3. Open <http://localhost:8080/assignment-4/>.

**NetBeans / Eclipse**

Create a Java Web application, then drop `index.jsp`, `bill.jsp`, `style.css`
and `script.js` into *Web Pages*, and `tariff.jspf` and `web.xml` into
*Web Pages / WEB-INF*. Run the project.

Nothing needs compiling first — there are no `.java` files, and the JSPs import
nothing from `javax.servlet`, so the same source runs unchanged on Jakarta EE
servers (Tomcat 10+). Only `web.xml` carries a namespace that is version
specific, and the file itself is optional; the comment at the top of it shows
the Jakarta replacement.

## How a request flows

1. `index.jsp` renders the form and prints the slab table as JSON for `script.js`.
2. The form POSTs `units` to `bill.jsp`.
3. `bill.jsp` calls `readUnits()`. Anything that is not a whole number in
   0 … 100,000 is rejected, and the page redirects back to `index.jsp` with the
   typed value and an explanation, so nothing has to be retyped.
4. A valid reading goes through `splitBill()`, which walks the slabs cheapest
   first and returns the total alongside the per-slab units and amounts.
5. The statement renders: amount payable, effective rate per unit, a stacked bar
   showing how the units divided across the slabs, and a four-row breakdown
   table with a total.

## Responsive behaviour

Mobile first, with two breakpoints.

- **Below 560px** — single column; the breakdown table stops being a table and
  stacks into labelled rows (each cell prints its own heading from
  `data-label`), and the recalculate button goes full width.
- **560px and up** — the recalculate field and its button sit side by side.
- **760px and up** — the sheet settles at its 720px measure and the side padding
  is dropped.
- Type scales fluidly with `clamp()` instead of jumping at breakpoints, so the
  readout stays large on a phone and never overflows.
- Dark mode follows the system setting via `prefers-color-scheme`; the slab
  colours lighten so they stay legible on the dark background.
- `@media print` strips the navigation and buttons and flattens the dark total
  panel, so **Print this bill** produces a clean sheet.
- `prefers-reduced-motion` switches off the transitions.

## Notes

- **Validation is server-side.** The `type="number"` field and the running
  estimate are conveniences; `bill.jsp` re-checks the reading regardless of
  what the browser sent.
- **User input is escaped.** A rejected reading is echoed back through `esc()`,
  so a value like `<script>` is printed, not run.
- **It works without JavaScript.** The slider and the running estimate are
  hidden until `script.js` adds a `js` class to the document. With scripting
  off, the form still posts and the server still bills.
- `bill.jsp` accepts GET as well as POST, so `bill.jsp?units=300` can be typed
  straight into the address bar while testing.

## Worked examples

| Units   | Working                                       | Bill         |
| ------- | --------------------------------------------- | ------------ |
| 0       | nothing consumed                              | ₹ 0.00       |
| 50      | 50×3.50                                       | ₹ 175.00     |
| 120     | 50×3.50 + 70×4.00                             | ₹ 455.00     |
| 200     | 50×3.50 + 100×4.00 + 50×5.20                  | ₹ 835.00     |
| 250     | 50×3.50 + 100×4.00 + 100×5.20                 | ₹ 1,095.00   |
| 300     | 50×3.50 + 100×4.00 + 100×5.20 + 50×6.50       | ₹ 1,420.00   |
| 1000    | 50×3.50 + 100×4.00 + 100×5.20 + 750×6.50      | ₹ 5,970.00   |
