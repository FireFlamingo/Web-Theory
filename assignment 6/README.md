# ClassForge UML — Assignment 6

An interactive React-based UML class diagram generator that converts a visual class architecture into Java source code.

## Features

- Create classes, abstract classes, and interfaces
- Add, edit, and remove attributes and operations
- Drag class cards around the UML canvas
- Model association, inheritance, aggregation, and composition
- Generate Java classes from the current diagram
- Copy or download the generated Java source
- Search classes and zoom the diagram canvas

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser.

## Production-style local preview

```bash
npm run build
npm start
```

The terminal prints the local URL after the server starts.

## Project structure

- `app/page.tsx` — UML editor and Java code generator
- `app/globals.css` — application theme and canvas styling
- `components/ui/` — reusable interface components
- `public/` — static assets
