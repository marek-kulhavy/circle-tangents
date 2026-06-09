# Analytical Geometry: Circle Tangents Editor

An interactive React application for calculating and visualizing all common tangents between multiple circles. Built with mathematical precision and a focus on performance.

## Features

- **Interactive Canvas:** Draw circles via click-and-drag (1st click sets center, mouse movement previews radius, 2nd click confirms).
- **Tangent Calculation:** Instantly computes all external and internal tangents for all unique pairs of circles.
- **Analytical Sidebar:** Live data display of coordinates (X, Y), radius (r), and exact touchpoints.
- **Visual Mapping:** Canvas elements (Circles K_n, Tangents T_n) are labeled to match the sidebar data perfectly.

## Tech Stack & Optimizations

- **React + TypeScript:** Type-safe components and predictable state management.
- **Tailwind CSS v4:** Clean layout leveraging native v4 features like fractional aspect ratios (`aspect-4/3`).
- **Optimized Canvas:** Event-driven rendering using `requestAnimationFrame` instead of infinite loops to save CPU/GPU.
- **`drawRef` Pattern:** High-performance resize handling without stale closures or redundant event listener re-binding.
- **High-DPI Support:** Sharp rendering on Retina/4K displays via `window.devicePixelRatio`.

````markdown
## Getting Started

Run the project locally in three steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/marek-kulhavy/circle-tangents.git](https://github.com/marek-kulhavy/circle-tangents.git)
   cd circle-tangents
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
