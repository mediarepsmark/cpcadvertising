"use client";

import { MAX_DAILY_BUDGET, parseBudgetAmount } from "@/lib/budgetPolicy";
import type { CampaignStepProps } from "@/types/campaign";

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const bidTypeOptions = ["cpm", "cpc"];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency"
  }).format(value);

export function BudgetStep({ draft, updateDraft }: CampaignStepProps) {
  const bidAmount = parseBudgetAmount(draft.bidAmount);
  const dailyBudget = parseBudgetAmount(draft.dailyBudget);
  const totalBudget = parseBudgetAmount(draft.totalBudget);
  const estimatedDailyClicks = draft.bidType === "cpc" && bidAmount ? Math.floor(dailyBudget / bidAmount) : 0;
  const estimatedTotalClicks = draft.bidType === "cpc" && bidAmount ? Math.floor(totalBudget / bidAmount) : 0;

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-extrabold uppercase text-brand-green">Customer chooses the click price</p>
        <h3 className="mt-1 text-lg font-extrabold">Set the max CPC and click budget</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          CPCAdvertising.com generates and runs the ads, then optimizes partner placements around the amount
          the customer is willing to pay for each click.
        </p>
      </section>

      <section className="rounded-lg border border-line bg-white p-4">
        <p className="text-xs font-extrabold uppercase text-brand-green">Cost transparency</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <CostTile label="Media budget" value={formatMoney(totalBudget)} detail="Used to buy clicks." />
          <CostTile
            label="Estimated clicks"
            value={draft.bidType === "cpc" ? estimatedTotalClicks.toLocaleString() : "CPM mode"}
            detail={draft.bidType === "cpc" ? `${estimatedDailyClicks.toLocaleString()} per day at max CPC` : "Clicks vary by CTR."}
          />
          <CostTile
            label="AI generation cost"
            value="Preview"
            detail="Future LLM costs will be passed through before launch."
          />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Pricing model</span>
          <select
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            value={draft.bidType}
            onChange={(event) => updateDraft({ bidType: event.target.value })}
          >
            {bidTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <CurrencyField
          label={draft.bidType === "cpc" ? "Max cost per click" : "Bid amount"}
          value={draft.bidAmount}
          onChange={(value) => updateDraft({ bidAmount: value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CurrencyField
          label="Daily click budget"
          max={MAX_DAILY_BUDGET}
          note={`Hard cap: ${formatMoney(MAX_DAILY_BUDGET)} per day.`}
          value={draft.dailyBudget}
          onChange={(value) => updateDraft({ dailyBudget: value })}
        />
        <CurrencyField
          label="Total click budget"
          value={draft.totalBudget}
          onChange={(value) => updateDraft({ totalBudget: value })}
        />
      </div>
    </div>
  );
}

function CostTile({ detail, label, value }: { detail: string; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <span className="block text-xs font-extrabold uppercase text-muted">{label}</span>
      <strong className="mt-1 block text-lg text-ink">{value}</strong>
      <span className="mt-1 block text-sm leading-5 text-muted">{detail}</span>
    </div>
  );
}

function CurrencyField({
  label,
  max,
  note,
  onChange,
  value
}: {
  label: string;
  max?: number;
  note?: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold uppercase text-muted">{label}</span>
      <input
        className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
        min="0"
        max={max}
        step="0.01"
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {note ? <span className="text-sm leading-5 text-muted">{note}</span> : null}
    </label>
  );
}
