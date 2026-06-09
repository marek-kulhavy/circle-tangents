import { useState, useMemo } from "react";
import { getAllPairsTangents } from "./geometry";
import type { Circle, Point } from "./types";

import CanvasEditor from "./CanvasEditor";

export default function App() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [drawingCenter, setDrawingCenter] = useState<Point | null>(null);
  const [showTangents, setShowTangents] = useState(false);

  const calculatedTangents = useMemo(() => {
    if (circles.length < 2) return [];
    return getAllPairsTangents(circles);
  }, [circles]);

  return (
    <div className="min-h-screen bg-[#baa89b]/10 text-[#524439] font-sans antialiased">
      {/* HEADER */}
      <header className="bg-white border-b border-[#baa89b]/30 py-5 px-8 sticky top-0 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#524439] tracking-tight">
              Geometrie tečen
            </h1>
            <p className="text-sm text-[#524439] mt-0.5">
              Interaktivní konstrukce společných tečen nad soustavou kružnic
            </p>
          </div>

          {/* STATE PANEL */}
          <div className="bg-[#baa89b]/15 border border-[#baa89b]/40 px-4 py-2.5 rounded-xl text-sm text-[#524439] min-w-60 h-11 flex items-center shadow-xs">
            <span className="font-medium">
              {drawingCenter
                ? "Urči poloměr a kliknutím potvrď."
                : "Klikni do plátna pro určení středu."}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* CANVAS EDITOR & BUTTONS */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <CanvasEditor
            circles={circles}
            onAddCircle={(c) => setCircles((prev) => [...prev, c])}
            tangents={calculatedTangents}
            showTangents={showTangents}
            drawingCenter={drawingCenter}
            onDrawingCenterChange={(center) => {
              setDrawingCenter(center);
              if (center) setShowTangents(false);
            }}
          />

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 justify-center w-full max-w-175">
            <button
              onClick={() => setShowTangents(true)}
              disabled={circles.length < 2 || drawingCenter !== null}
              className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-150 active:scale-98 ${
                circles.length < 2 || drawingCenter !== null
                  ? "bg-[#baa89b]/30 text-[#baa89b] cursor-not-allowed shadow-none"
                  : "bg-[#00917c] hover:bg-[#005d4b] text-white"
              }`}
            >
              Vypočítat společné tečny ({calculatedTangents.length})
            </button>

            <button
              onClick={() => {
                setCircles([]);
                setDrawingCenter(null);
                setShowTangents(false);
              }}
              className="px-6 py-3 rounded-xl font-semibold bg-white border border-[#baa89b] text-[#524439] shadow-sm hover:bg-[#baa89b]/10 active:scale-98 transition-all duration-150"
            >
              Vymazat plátno
            </button>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col gap-6 sticky top-28 lg:col-span-1 w-full">
          {/* CARD 1 - CIRCLES */}
          <div className="bg-white border border-[#baa89b]/30 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#b3691e]">
                Vykreslené kružnice ({circles.length})
              </h2>
            </div>

            {circles.length === 0 ? (
              <p className="text-sm text-[#baa89b] italic py-2">
                Zatím nebyly zadány žádné kružnice.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {circles.map((c, i) => (
                  <div
                    key={i}
                    className="bg-[#baa89b]/5 border border-[#baa89b]/20 p-3 rounded-xl text-sm font-mono flex flex-col gap-0.5"
                  >
                    <div className="font-semibold text-[#b3691e] text-xs">
                      Kružnice K{i + 1}
                    </div>
                    <div>
                      Střed S: [{Math.round(c.x)}, {Math.round(c.y)}]
                    </div>
                    <div>Poloměr r: {Math.round(c.r)} px</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CARD 2 - TANGENTS */}
          <div className="bg-white border border-[#baa89b]/30 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#00917c]">
                Společné tečny ({showTangents ? calculatedTangents.length : 0})
              </h2>
            </div>

            {!showTangents ? (
              <p className="text-sm text-[#baa89b] italic py-2">
                Výpočet dosud nebyl spuštěn.
              </p>
            ) : calculatedTangents.length === 0 ? (
              <p className="text-sm text-[#b3691e] bg-[#b3691e]/5 border border-[#b3691e]/20 p-3 rounded-xl italic">
                Pro vybrané kružnice neexistují žádné společné tečny.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {calculatedTangents.map((t, i) => (
                  <div
                    key={i}
                    className="bg-[#baa89b]/5 border border-[#baa89b]/20 p-2.5 rounded-xl text-xs font-mono flex flex-col gap-1"
                  >
                    <div className="font-semibold text-[#00917c]">
                      Tečna T{i + 1}
                    </div>
                    <div>
                      Bod 1: [{Math.round(t.p1.x)}, {Math.round(t.p1.y)}]
                    </div>
                    <div>
                      Bod 2: [{Math.round(t.p2.x)}, {Math.round(t.p2.y)}]
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
