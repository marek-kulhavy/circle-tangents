import React, { useRef, useEffect, useCallback } from "react";
import type { Circle, Point, Line } from "./types";

type CanvasEditorProps = {
  circles: Circle[];
  onAddCircle: (circle: Circle) => void;
  tangents: Line[];
  showTangents: boolean;
  drawingCenter: Point | null;
  onDrawingCenterChange: (center: Point | null) => void;
};

export default function CanvasEditor({
  circles,
  onAddCircle,
  tangents,
  showTangents,
  drawingCenter,
  onDrawingCenterChange,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef<Point>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = canvas.width / dpr;
    const logicalHeight = canvas.height / dpr;

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    // Grid
    ctx.strokeStyle = "rgba(186, 168, 155, 0.25)";
    ctx.lineWidth = 0.5;

    for (let x = 20; x < logicalWidth; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, logicalHeight);
      ctx.stroke();
    }

    for (let y = 20; y < logicalHeight; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(logicalWidth, y);
      ctx.stroke();
    }

    // Circles
    circles.forEach((c, index) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.strokeStyle = "#b3691e";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#524439";
      ctx.fill();

      ctx.fillStyle = "#524439";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`K${index + 1}`, c.x + 8, c.y - 8);
    });

    // Circles being drawn
    if (drawingCenter) {
      const mouse = mousePosRef.current;
      const r = Math.hypot(
        mouse.x - drawingCenter.x,
        mouse.y - drawingCenter.y,
      );

      ctx.beginPath();
      ctx.arc(drawingCenter.x, drawingCenter.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#baa89b";
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(drawingCenter.x, drawingCenter.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#b3691e";
      ctx.fill();
    }

    // Tangents
    if (showTangents) {
      const EXTENT = Math.hypot(logicalWidth, logicalHeight) * 2;

      tangents.forEach((t, index) => {
        const dx = t.p2.x - t.p1.x;
        const dy = t.p2.y - t.p1.y;
        const length = Math.hypot(dx, dy);

        if (length < 1e-9) return;

        const nx = dx / length;
        const ny = dy / length;

        ctx.strokeStyle = "#00917c";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(t.p1.x - nx * EXTENT, t.p1.y - ny * EXTENT);
        ctx.lineTo(t.p2.x + nx * EXTENT, t.p2.y + ny * EXTENT);
        ctx.stroke();

        const midX = (t.p1.x + t.p2.x) / 2;
        const midY = (t.p1.y + t.p2.y) / 2;
        const label = `T${index + 1}`;

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.lineJoin = "round";
        ctx.font = "bold 13px sans-serif";
        ctx.strokeText(label, midX + 8, midY - 8);

        ctx.fillStyle = "#005d4b";
        ctx.fillText(label, midX + 8, midY - 8);
      });
    }
  }, [circles, tangents, showTangents, drawingCenter]);

  // Setup a resize listener
  const drawRef = useRef(draw);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    setupCanvas();

    const handleResize = () => {
      setupCanvas();
      drawRef.current();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setupCanvas]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getEventCoords = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div className="bg-white p-3 rounded-2xl shadow-xl border border-[#baa89b]/30 aspect-4/3 w-full max-w-175 relative">
      <canvas
        ref={canvasRef}
        className="bg-[#baa89b]/5 cursor-crosshair rounded-xl block w-full h-full border border-[#baa89b]/10 absolute inset-0 m-auto"
        style={{ width: "calc(100% - 24px)", height: "calc(100% - 24px)" }}
        onClick={(e) => {
          const { x, y } = getEventCoords(e);

          if (!drawingCenter) {
            onDrawingCenterChange({ x, y });
            return;
          }

          const r = Math.hypot(x - drawingCenter.x, y - drawingCenter.y);

          if (r > 4) {
            onAddCircle({
              x: drawingCenter.x,
              y: drawingCenter.y,
              r,
            });
          }

          onDrawingCenterChange(null);
        }}
        onMouseMove={(e) => {
          mousePosRef.current = getEventCoords(e);

          if (drawingCenter) {
            if (rafRef.current !== null) {
              cancelAnimationFrame(rafRef.current);
            }
            rafRef.current = requestAnimationFrame(() => {
              draw();
            });
          }
        }}
      />
    </div>
  );
}
