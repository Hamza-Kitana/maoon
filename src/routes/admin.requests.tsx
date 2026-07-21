import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useApp } from "@/store/app";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategoriesList } from "@/store/content";
import { CheckCircle2, XCircle, Clock, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import type { AidRequest } from "@/store/app";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequests,
});

function AdminRequests() {
  const requests = useApp((s) => s.requests);
  const approve = useApp((s) => s.approveRequest);
  const reject = useApp((s) => s.rejectRequest);
  const del = useApp((s) => s.deleteRequest);
  const update = useApp((s) => s.updateRequest);
  const categories = useCategoriesList();

  const [tab, setTab] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selected, setSelected] = useState<AidRequest | null>(null);
  const [editing, setEditing] = useState<AidRequest | null>(null);
  const [note, setNote] = useState("");

  const filtered = tab === "all" ? requests : requests.filter((r) => r.status === tab);

  return (
    <>
      <AdminHeader title="إدارة الطلبات" subtitle="راجع، وافق، ارفض، عدّل، أو احذف" />
      <div className="p-8">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="pending">قيد المراجعة ({requests.filter((r) => r.status === "pending").length})</TabsTrigger>
            <TabsTrigger value="approved">معتمد</TabsTrigger>
            <TabsTrigger value="rejected">مرفوض</TabsTrigger>
            <TabsTrigger value="all">الكل</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-16 text-center text-muted-foreground">لا توجد طلبات</div>
          ) : (
            filtered.map((r) => {
              const cat = categories.find((c) => c.slug === r.categorySlug);
              return (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="grid md:grid-cols-[1fr_auto] gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={r.status} />
                        <Badge variant="outline">{cat?.title}</Badge>
                        <span className="text-xs text-muted-foreground">{r.anonymous ? "طلب مجهول للعامة" : `من: ${r.userName}`}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold">{r.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.description}</p>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">المبلغ المطلوب:</span>{" "}
                        <strong className="text-primary">{r.amountNeeded.toLocaleString("ar")} د.أ</strong>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-start gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
                        <Eye className="h-4 w-4" /> عرض
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(r)}>
                        <Pencil className="h-4 w-4" /> تعديل
                      </Button>
                      {r.status !== "approved" && (
                        <Button size="sm" onClick={() => { approve(r.id); toast.success("تمت الموافقة"); }} className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle2 className="h-4 w-4" /> موافقة
                        </Button>
                      )}
                      {r.status !== "rejected" && (
                        <Button size="sm" variant="destructive" onClick={() => setSelected({ ...r, status: "__reject" as any })}>
                          <XCircle className="h-4 w-4" /> رفض
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => { if (confirm("حذف الطلب؟")) { del(r.id); toast.success("تم الحذف"); } }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* View / Reject */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{(selected as any)?.status === "__reject" ? "رفض الطلب" : "تفاصيل الطلب"}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div><strong>العنوان:</strong> {selected.title}</div>
              <div><strong>الوصف:</strong><p className="mt-1 text-muted-foreground">{selected.description}</p></div>
              <div><strong>المبلغ:</strong> {selected.amountNeeded.toLocaleString("ar")} د.أ</div>
              <div><strong>المستفيد:</strong> {selected.userName}</div>
              {(selected as any).status === "__reject" && (
                <div>
                  <Label>سبب الرفض</Label>
                  <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="سبب الرفض..." />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setSelected(null); setNote(""); }}>إغلاق</Button>
            {(selected as any)?.status === "__reject" && (
              <Button variant="destructive" onClick={() => {
                if (!note.trim()) return toast.error("أدخل سبب الرفض");
                reject(selected!.id, note);
                toast.success("تم رفض الطلب");
                setSelected(null);
                setNote("");
              }}>تأكيد الرفض</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>تعديل الطلب</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>العنوان</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <Label>المبلغ</Label>
                <Input type="number" value={editing.amountNeeded} onChange={(e) => setEditing({ ...editing, amountNeeded: Number(e.target.value) })} />
              </div>
              <div>
                <Label>ملاحظة الإدارة</Label>
                <Textarea rows={2} value={editing.adminNote ?? ""} onChange={(e) => setEditing({ ...editing, adminNote: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>إلغاء</Button>
            <Button onClick={() => {
              if (!editing) return;
              update(editing.id, editing);
              toast.success("تم التحديث");
              setEditing(null);
            }}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return <Badge className="bg-emerald-600 text-white gap-1"><CheckCircle2 className="h-3 w-3" />معتمد</Badge>;
  if (status === "rejected") return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />مرفوض</Badge>;
  return <Badge className="bg-amber-500 text-white gap-1"><Clock className="h-3 w-3" />قيد المراجعة</Badge>;
}
