
import { Bell, ChevronRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";


interface WeeklyOverviewProps {
  mealImageSrc?: string;
}

const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({ mealImageSrc }) => {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-md mx-auto flex flex-col gap-3 pb-28">

        {/* Top bar */}
        <div className="flex items-center justify-between pt-4 px-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-green-700">
            Oversikt
          </span>
          <div className="flex items-center gap-3">
            <button
              aria-label="Varsler"
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
            >
              <Bell size={20} strokeWidth={1.8} />
            </button>
            <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold select-none">
              A
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="px-4">
          <p className="text-xs text-stone-400">Torsdag 16. april</p>
          <h1 className="text-2xl font-bold text-stone-900 mt-0.5 leading-tight">
            God kveld, André! 👋
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Her er planen for uken din
          </p>
        </div>

        {/* Budget card */}
        <div className="px-4">
          <Card className="rounded-2xl border-0 shadow-sm bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
              Ditt budsjett
            </p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-extrabold text-stone-900 leading-none">
                1 240 kr
              </span>
              <span className="text-sm text-stone-400 mb-0.5">
                igjen av 2 000 kr
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-100">
              <div
                className="h-2.5 rounded-full bg-green-700"
                style={{ width: "62%" }}
              />
            </div>
            <p className="text-xs text-stone-400 mt-1.5">62 %</p>
          </Card>
        </div>

        {/* Week summary card */}
        <div className="px-4">
          <Card className="rounded-2xl border-0 shadow-sm bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                  Uken din
                </p>
                <p className="text-base font-semibold text-stone-900">
                  4 av 7 middager planlagt
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl bg-green-50 text-green-700 hover:bg-green-100 font-semibold text-sm whitespace-nowrap border-0 shadow-none"
              >
                Se ukeplan
              </Button>
            </div>
          </Card>
        </div>

        {/* Featured meal card */}
        <div className="px-4">
          <div className="rounded-2xl overflow-hidden shadow-sm relative min-h-[200px] bg-stone-600">
            {mealImageSrc ? (
              <img
                src={mealImageSrc}
                alt="Ovnsbakt laks med poteter og grønnsaker"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-stone-400 to-stone-700" />
            )}

            {/* Top label */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-sm">
                Dagens middag
              </span>
            </div>

            {/* Arrow CTA */}
            <button
              aria-label="Se oppskrift"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>

            {/* Bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-14 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <h2 className="text-xl font-bold text-white leading-tight">
                Ovnsbakt laks
              </h2>
              <p className="text-sm text-white/80">med poteter og grønnsaker</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white bg-white/20 backdrop-blur-sm">
                  <Clock size={11} />
                  25 min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings card */}
        <div className="px-4">
          <Card className="rounded-2xl border-0 shadow-sm bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-stone-900">
                  Du sparer godt!
                </p>
                <p className="text-sm text-green-800/80 mt-0.5">
                  Du har spart{" "}
                  <span className="font-bold text-green-700">320 kr</span>{" "}
                  så langt denne uken
                </p>
              </div>
              <span className="text-4xl select-none ml-3 leading-none">🌱</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default WeeklyOverview;
