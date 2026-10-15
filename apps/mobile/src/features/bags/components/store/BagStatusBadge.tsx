import { BAG_STATUS, type BagStatus } from "@relife/shared";
import { StatusBadge, type StatusTone } from "@relife/ui";

const VIEW: Record<BagStatus, { label: string; tone: StatusTone }> = {
  [BAG_STATUS.LIVE]: { label: "Đang bán", tone: "dark" },
  [BAG_STATUS.PAUSED]: { label: "Tạm dừng", tone: "warning" },
  [BAG_STATUS.DRAFT]: { label: "Nháp", tone: "neutral" },
  [BAG_STATUS.SOLD_OUT]: { label: "Hết hàng", tone: "danger" },
  [BAG_STATUS.ENDED]: { label: "Đã kết thúc", tone: "neutral" },
};

export function BagStatusBadge({ status }: { status: BagStatus }) {
  const v = VIEW[status];
  return <StatusBadge label={v.label} tone={v.tone} />;
}
