import type { Circle, Line } from "./types";

export function getTangents(c1: Circle, c2: Circle): Line[] {
  const tangents: Line[] = [];
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const d = Math.hypot(dx, dy);

  // if circles are coincident or one is inside the other, there are no tangents
  if (d < 0.001) return tangents;

  const angle = Math.atan2(dy, dx);

  // External tangents
  if (d >= Math.abs(c1.r - c2.r)) {
    const beta = Math.acos(Math.max(-1, Math.min(1, (c1.r - c2.r) / d)));
    const a1 = angle + beta;
    const a2 = angle - beta;

    tangents.push({
      p1: { x: c1.x + c1.r * Math.cos(a1), y: c1.y + c1.r * Math.sin(a1) },
      p2: { x: c2.x + c2.r * Math.cos(a1), y: c2.y + c2.r * Math.sin(a1) },
    });

    // Prevents the insertion of duplicate coincident tangents
    if (beta > 1e-6) {
      tangents.push({
        p1: { x: c1.x + c1.r * Math.cos(a2), y: c1.y + c1.r * Math.sin(a2) },
        p2: { x: c2.x + c2.r * Math.cos(a2), y: c2.y + c2.r * Math.sin(a2) },
      });
    }
  }

  // Internal tangents (cross between circles)
  if (d >= c1.r + c2.r) {
    const beta = Math.acos(Math.max(-1, Math.min(1, (c1.r + c2.r) / d)));
    const a1 = angle + beta;
    const a2 = angle - beta;

    tangents.push({
      p1: { x: c1.x + c1.r * Math.cos(a1), y: c1.y + c1.r * Math.sin(a1) },
      p2: { x: c2.x - c2.r * Math.cos(a1), y: c2.y - c2.r * Math.sin(a1) },
    });

    // Prevents the insertion of duplicate coincident tangents
    if (beta > 1e-6) {
      tangents.push({
        p1: { x: c1.x + c1.r * Math.cos(a2), y: c1.y + c1.r * Math.sin(a2) },
        p2: { x: c2.x - c2.r * Math.cos(a2), y: c2.y - c2.r * Math.sin(a2) },
      });
    }
  }

  return tangents;
}

export function getAllPairsTangents(circles: Circle[]): Line[] {
  const allTangents: Line[] = [];
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      allTangents.push(...getTangents(circles[i], circles[j]));
    }
  }
  return allTangents;
}
