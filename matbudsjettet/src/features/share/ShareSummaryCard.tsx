import { Download, Share2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { formatCompactNok } from "@/lib/utils/format";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";
import { createShareCardData, type ShareCardData } from "./shareCardData";

type ShareSummaryCardProps = {
  preference: BudgetPreference;
  plan: WeeklyPlan;
};

type ShareSummarySheetProps = ShareSummaryCardProps & {
  onClose: () => void;
};

export function ShareSummarySheet({ onClose, plan, preference }: ShareSummarySheetProps) {
  const [feedback, setFeedback] = useState("");
  const data = useMemo(() => createShareCardData(plan, preference), [plan, preference]);

  const handleShare = async () => {
    const text = `${data.shareText}\n\nUkestotal: ${data.weeklyTotalLabel}\nMiddag jeg gleder meg til: ${data.featuredMeal.name}`;

    if (navigator.share) {
      await navigator.share({ text, title: "Min uke med Matbudsjettet" });
      return;
    }

    await navigator.clipboard.writeText(text);
    setFeedback("Kopiert til utklippstavlen");
  };

  const handleExportImage = async () => {
    await exportShareCardImage(data);
    setFeedback("Bilde klart");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-text-primary/30 px-app-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-app-4 shadow-app">
        <div className="flex items-center justify-between gap-app-3">
          <div>
            <p className="text-caption uppercase text-text-tertiary">Del ukeplanen</p>
            <h2 className="text-title text-text-primary">Klar for deling</h2>
          </div>
          <button
            aria-label="Lukk"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border-subtle bg-surface text-text-secondary"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-app-4">
          <ShareSummaryCard plan={plan} preference={preference} />
        </div>

        <div className="mt-app-6 grid grid-cols-2 gap-app-2">
          <Button className="gap-app-2" onClick={handleShare} type="button">
            <Share2 size={17} />
            Del
          </Button>
          <Button className="gap-app-2" onClick={handleExportImage} type="button" variant="secondary">
            <Download size={17} />
            Bilde
          </Button>
        </div>
        <p className="mt-app-3 min-h-4 text-center text-caption text-text-tertiary">
          {feedback || "Del som tekst eller lagre et enkelt bilde."}
        </p>
      </div>
    </div>
  );
}

export function ShareSummaryCard({ plan, preference }: ShareSummaryCardProps) {
  const data = createShareCardData(plan, preference);
  const isOverBudget = plan.summary.budgetComparison.differenceNok < 0;

  return (
    <Card className="overflow-hidden p-0" variant="default">
      <div className="bg-surface p-app-5">
        <div className="flex items-start justify-between gap-app-4">
          <div>
            <p className="text-caption uppercase text-text-tertiary">Matbudsjettet</p>
            <h3 className="mt-app-2 text-title text-text-primary">{data.headline}</h3>
          </div>
          <div className="rounded-lg bg-saving-bg px-2 py-1 text-caption font-black text-saving">{data.modeLabel}</div>
        </div>

        <div className="mt-app-5 grid grid-cols-2 gap-app-3">
          <ShareMetric label="Ukestotal" value={data.weeklyTotalLabel} />
          <ShareMetric
            label="Mot budsjett"
            tone={isOverBudget ? "danger" : "saving"}
            value={data.budgetLine}
          />
        </div>

        <div className="mt-app-4 rounded-lg border border-border-subtle bg-surface p-app-4">
          <div className="flex items-center justify-between gap-app-3">
            <div>
              <p className="text-caption text-text-tertiary">Ukens middag</p>
              <p className="mt-1 font-black text-text-primary">{data.featuredMeal.name}</p>
            </div>
            <Badge
              tone={
                data.featuredMeal.mealTag === "Budsjett"
                  ? "saving"
                  : data.featuredMeal.mealTag === "Premium"
                    ? "neutral"
                    : "warm"
              }
            >
              {data.featuredMeal.mealTag}
            </Badge>
          </div>
          <p className="mt-app-2 text-body-sm text-text-secondary">
            {data.featuredMeal.weekday} · {formatCompactNok(data.featuredMeal.totalPriceNok)}
          </p>
        </div>
      </div>
      <div className="border-t border-border-subtle bg-surface px-app-5 py-app-3 text-center text-caption text-text-tertiary">
        Planlagt med Matbudsjettet
      </div>
    </Card>
  );
}

function ShareMetric({
  label,
  tone = "neutral",
  value
}: {
  label: string;
  tone?: "neutral" | "saving" | "danger";
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-app-3">
      <p className="text-caption text-text-tertiary">{label}</p>
      <p
        className={cn(
          "mt-app-1 text-headline",
          tone === "saving" ? "text-saving" : "",
          tone === "danger" ? "text-danger" : "",
          tone === "neutral" ? "text-text-primary" : ""
        )}
      >
        {value}
      </p>
    </div>
  );
}

const exportShareCardImage = async (data: ShareCardData) => {
  const svg = createShareCardSvg(data);
  const image = new Image();
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");

  if (!context) {
    URL.revokeObjectURL(url);
    return;
  }

  context.drawImage(image, 0, 0);
  URL.revokeObjectURL(url);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));

  if (!blob) {
    return;
  }

  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "matbudsjettet-ukeplan.png";
  anchor.click();
  URL.revokeObjectURL(downloadUrl);
};

const escapeSvg = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const createShareCardSvg = (data: ShareCardData) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <rect width="1080" height="1350" fill="#0B0F1A"/>
  <circle cx="120" cy="90" r="330" fill="#6C5CE7" opacity="0.34"/>
  <rect x="72" y="84" width="936" height="1182" rx="38" fill="#151B2A" stroke="#2A3244" stroke-width="3"/>
  <text x="120" y="160" fill="#A1A7B3" font-family="Arial, sans-serif" font-size="34" font-weight="700">MATBUDSJETTET</text>
  <rect x="760" y="120" width="190" height="58" rx="29" fill="#241F58"/>
  <text x="855" y="158" text-anchor="middle" fill="#8F7DFF" font-family="Arial, sans-serif" font-size="26" font-weight="700">${escapeSvg(data.modeLabel)}</text>
  <text x="120" y="275" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="66" font-weight="800">${escapeSvg(data.weeklyTotalLabel)}</text>
  <text x="120" y="345" fill="#A1A7B3" font-family="Arial, sans-serif" font-size="38" font-weight="700">${escapeSvg(data.headline)}</text>
  <rect x="120" y="430" width="396" height="190" rx="24" fill="#1A2233" stroke="#2A3244" stroke-width="2"/>
  <text x="154" y="500" fill="#6F7787" font-family="Arial, sans-serif" font-size="28" font-weight="700">Ukestotal</text>
  <text x="154" y="568" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="48" font-weight="800">${escapeSvg(data.weeklyTotalLabel)}</text>
  <rect x="564" y="430" width="396" height="190" rx="24" fill="#143424" stroke="#245A3B" stroke-width="2"/>
  <text x="598" y="500" fill="#44D07B" font-family="Arial, sans-serif" font-size="28" font-weight="700">Mot budsjett</text>
  <text x="598" y="568" fill="#44D07B" font-family="Arial, sans-serif" font-size="40" font-weight="800">${escapeSvg(data.budgetLine)}</text>
  <rect x="120" y="700" width="840" height="270" rx="28" fill="#1A2233" stroke="#2A3244" stroke-width="2"/>
  <text x="160" y="770" fill="#6F7787" font-family="Arial, sans-serif" font-size="28" font-weight="700">Ukens middag</text>
  <text x="160" y="840" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="46" font-weight="800">${escapeSvg(data.featuredMeal.name)}</text>
  <text x="160" y="910" fill="#A1A7B3" font-family="Arial, sans-serif" font-size="32" font-weight="700">${escapeSvg(data.featuredMeal.weekday ?? "Denne uken")} · ${escapeSvg(formatCompactNok(data.featuredMeal.totalPriceNok))}</text>
  <text x="540" y="1160" text-anchor="middle" fill="#A1A7B3" font-family="Arial, sans-serif" font-size="30" font-weight="700">Planlagt med Matbudsjettet</text>
</svg>`;
