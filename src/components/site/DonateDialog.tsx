import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/app";
import { toast } from "sonner";
import { CreditCard, HandCoins, Lock, Loader2 } from "lucide-react";

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidExpiry(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiry = new Date(year, month);
  return expiry > now;
}

export function DonateDialog({
  open,
  onOpenChange,
  categorySlug,
  requestId,
  title = "تبرع الآن",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categorySlug?: string;
  requestId?: string;
  title?: string;
}) {
  const donate = useApp((s) => s.donate);
  const user = useApp((s) => s.currentUser());
  const [amount, setAmount] = useState(50);
  const [name, setName] = useState(user?.name ?? "");
  const [anonymous, setAnonymous] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);

  const resetForm = () => {
    setAmount(50);
    setCardName("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setPaying(false);
  };

  const submit = async () => {
    if (amount <= 0) return toast.error("الرجاء إدخال مبلغ صحيح");
    if (!cardName.trim()) return toast.error("أدخل الاسم على البطاقة");
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length !== 16) return toast.error("رقم بطاقة الفيزا يجب أن يكون 16 رقمًا");
    if (!isValidExpiry(expiry)) return toast.error("تاريخ انتهاء البطاقة غير صالح");
    if (cvv.length < 3) return toast.error("أدخل رمز الأمان CVV");

    setPaying(true);
    await new Promise((r) => setTimeout(r, 1400));

    donate({
      amount,
      categorySlug,
      requestId,
      donorName: anonymous ? "متبرع مجهول" : name || user?.name || "متبرع كريم",
    });

    toast.success("تم الدفع بنجاح عبر Visa", {
      description: `تم استلام ${amount.toLocaleString("ar")} د.أ — شكرًا لكرمك`,
    });
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!paying) {
          onOpenChange(v);
          if (!v) resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-deep text-primary-foreground shadow-elegant">
            <HandCoins className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            الدفع عبر بطاقة Visa — كل مبلغ يصل بشفافية كاملة إلى مستحقيه.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((v) => (
              <button
                key={v}
                type="button"
                disabled={paying}
                onClick={() => setAmount(v)}
                className={`rounded-xl border py-2 text-sm font-semibold transition ${
                  amount === v
                    ? "border-gold bg-gold/10 text-primary"
                    : "border-border hover:border-gold/60"
                }`}
              >
                {v} د.أ
              </button>
            ))}
          </div>

          <div>
            <Label>مبلغ مخصص (د.أ)</Label>
            <Input
              type="number"
              min={1}
              disabled={paying}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>الاسم الذي يظهر مع التبرع</Label>
            <Input
              placeholder="اسمك الكريم"
              disabled={anonymous || paying}
              value={anonymous ? "متبرع مجهول" : name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={anonymous}
              disabled={paying}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            التبرع بشكل مجهول (إخفاء الاسم)
          </label>

          <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CreditCard className="h-4 w-4 text-primary" />
                الدفع ببطاقة Visa
              </div>
              <div className="rounded-md bg-[#1A1F71] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
                VISA
              </div>
            </div>

            <div>
              <Label>الاسم على البطاقة</Label>
              <Input
                placeholder="كما هو مكتوب على البطاقة"
                disabled={paying}
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                autoComplete="cc-name"
              />
            </div>

            <div>
              <Label>رقم بطاقة Visa</Label>
              <Input
                inputMode="numeric"
                placeholder="XXXX XXXX XXXX XXXX"
                disabled={paying}
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                autoComplete="cc-number"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>تاريخ الانتهاء</Label>
                <Input
                  inputMode="numeric"
                  placeholder="MM/YY"
                  disabled={paying}
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  autoComplete="cc-exp"
                  maxLength={5}
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input
                  inputMode="numeric"
                  placeholder="123"
                  disabled={paying}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  autoComplete="cc-csc"
                  maxLength={4}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              بيانات البطاقة محمية ولا تُحفظ بعد إتمام الدفع.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" disabled={paying} onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            onClick={submit}
            disabled={paying}
            className="bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold"
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الدفع...
              </>
            ) : (
              <>ادفع {amount.toLocaleString("ar")} د.أ عبر Visa</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
