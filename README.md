# Analytical Geometry: Circle Tangents Editor

An interactive React application designed to calculate and visualize all common tangents between multiple circles.

## Features

- **Interactive Canvas:** Draw circles effortlessly on a grid-based canvas (1st click sets the center, mouse movement previews the radius, 2nd click confirms).
- **Tangent Calculation:** Instantly computes and displays all existing external and internal tangents for all unique pairs of circles.
- **Analytical Sidebar:** Displays real-time coordinate data ($X, Y$) and radius ($r$) for each circle, along with specific touchpoints for every computed tangent.
- **Visual Mapping:** All components on the canvas (Circles $K_n$, Tangents $T_n$) are labeled to perfectly match the data in the analytical sidebar.

## Tech Stack & Optimizations

- **React + TypeScript:** Strongly typed components ensuring high code reliability.
- **Tailwind CSS v4:** Clean, modern, and fully responsive layout without content shifting.
- **Event-Driven Canvas:** Avoids traditional infinite rendering loops (`requestAnimationFrame`). The canvas redraws *only* when the state changes or during active circle creation, drastically reducing CPU/GPU usage.
- **Aspect Ratio Compensation:** Handlers automatically calculate the scale ratio between the visual CSS bounds and internal canvas dimensions, ensuring pixel-perfect cursor precision on all screens.

## Getting Started

1. **Clone the repository and navigate to the folder:**
    ```bash
    cd circle-tangents

2. **Install dependencies:**
    ```bash
    npm install

3. **Clone the repository and navigate to the folder:**
    ```bash
    npm run dev

4. **Open http://localhost:5173/ in your browser.**