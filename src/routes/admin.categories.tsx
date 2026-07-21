import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Field, AreaField, ImageField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/app";
import { useContent, useCategoriesList } from "@/store/content";
import {
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_IMAGES,
  resolveCategory,
  type CategoryData,
} from "@/lib/categories";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

const EMPTY: CategoryData = {
  slug: "",
  title: "",
  short: "",
  desc: "",
  iconName: "heart-handshake",
  color: "from-emerald-600/20 to-amber-500/10",
  image: "",
  longDesc: "",
  whoWeHelp: [],
  howItWorks: [],
  impact: "",
};

function AdminCategories() {
  const categories = useCategoriesList();
  const rawCategories = useContent((s) => s.categories);
  const addCategory = useContent((s) => s.addCategory);
  const updateCategory = useContent((s) => s.updateCategory);
  const deleteCategory = useContent((s) => s.deleteCategory);
  const requests = useApp((s) => s.requests);
  const donations = useApp((s) => s.donations);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null); // null = new
  const [form, setForm] = useState<CategoryData>(EMPTY);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  const openNew = () => {
    setEditingSlug(null);
    setForm(EMPTY);
    setEditorOpen(true);
  };

  const openEdit = (slug: string) => {
    const raw = rawCategories.find((c) => c.slug === slug);
    if (!raw) return;
    setEditingSlug(slug);
    setForm({ ...raw });
    setEditorOpen(true);
  };

  const submit = () => {
    if (!form.title.trim()) return toast.error("أدخل اسم القسم");
    if (!form.short.trim()) return toast.error("أدخل الوصف المختصر");
    if (!form.desc.trim()) return toast.error("أدخل الوصف التعريفي");

    if (editingSlug) {
      updateCategory(editingSlug, form);
      toast.success("تم تحديث القسم بنجاح");
    } else {
      const slug = `cat-${Date.now().toString(36)}`;
      addCategory({ ...form, slug });
      toast.success("تمت إضافة القسم الجديد — أصبح ظاهراً في الموقع");
    }
    setEditorOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteSlug) return;
    deleteCategory(deleteSlug);
    toast.success("تم حذف القسم");
    setDeleteSlug(null);
  };

  const deletingCat = categories.find((c) => c.slug === deleteSlug);

  return (
    <>
      <AdminHeader title="أقسام التبرع" subtitle="أضف، عدّل، أو احذف خدمات التبرع الظاهرة في الموقع" />
      <div className="p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LayoutGrid className="h-4 w-4" />
            {categories.length.toLocaleString("ar")} قسم فعّال
          </div>
          <Button onClick={openNew} className="bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
            <Plus className="h-4 w-4" /> إضافة قسم جديد
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => {
            const reqCount = requests.filter((r) => r.categorySlug === c.slug).length;
            const raised = donations
              .filter((d) => d.categorySlug === c.slug)
              .reduce((a, d) => a + d.amount, 0);
            return (
              <div key={c.slug} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-elegant">
                <div className="relative h-36 overflow-hidden">
                  <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/85 via-emerald-deep/20 to-transparent" />
                  <div className="absolute bottom-3 right-4 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-gold-foreground shadow-gold">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <div className="font-display text-lg font-bold text-white">{c.title}</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-gold">{c.short}</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{c.desc}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline">{reqCount.toLocaleString("ar")} طلب</Badge>
                    <Badge variant="outline">{raised.toLocaleString("ar")} د.أ تبرعات</Badge>
                  </div>
                  <div className="mt-4 flex gap-2 border-t border-border pt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(c.slug)}>
                      <Pencil className="h-3.5 w-3.5" /> تعديل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setDeleteSlug(c.slug)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> حذف
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingSlug ? "تعديل القسم" : "إضافة قسم جديد"}
            </DialogTitle>
            <DialogDescription>
              كل ما تدخله هنا يظهر مباشرة في صفحات الموقع بعد الحفظ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="اسم القسم" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="مثال: الأيتام" />
              <Field label="وصف مختصر (سطر واحد)" value={form.short} onChange={(v) => setForm({ ...form, short: v })} placeholder="مثال: كفالة ورعاية شاملة" />
            </div>

            <AreaField label="الوصف التعريفي (يظهر في البطاقات)" rows={2} value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} />

            <ImageField
              label="صورة القسم"
              value={form.image}
              defaultImage={editingSlug ? DEFAULT_CATEGORY_IMAGES[editingSlug] : undefined}
              onChange={(v) => setForm({ ...form, image: v })}
            />

            {/* Icon picker */}
            <div>
              <Label>أيقونة القسم</Label>
              <div className="mt-2 grid grid-cols-6 sm:grid-cols-9 gap-2">
                {Object.entries(CATEGORY_ICONS).map(([name, Icon]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setForm({ ...form, iconName: name })}
                    className={`grid h-11 w-full place-items-center rounded-xl border transition-all ${
                      form.iconName === name
                        ? "border-gold bg-gold/15 text-primary shadow-sm"
                        : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            <AreaField
              label="الشرح الكامل (يظهر في صفحة القسم)"
              rows={4}
              value={form.longDesc}
              onChange={(v) => setForm({ ...form, longDesc: v })}
            />

            <AreaField
              label="من نساعد؟ (كل سطر = نقطة)"
              rows={4}
              value={form.whoWeHelp.join("\n")}
              onChange={(v) => setForm({ ...form, whoWeHelp: v.split("\n").filter((l) => l.trim()) })}
              hint="اكتب كل فئة مستفيدة في سطر مستقل"
            />

            <AreaField
              label="آلية العمل (كل سطر = خطوة)"
              rows={4}
              value={form.howItWorks.join("\n")}
              onChange={(v) => setForm({ ...form, howItWorks: v.split("\n").filter((l) => l.trim()) })}
              hint="اكتب كل خطوة في سطر مستقل — يُفضل ٤ خطوات"
            />

            <Field label="عبارة الأثر (اقتباس ملهم)" value={form.impact} onChange={(v) => setForm({ ...form, impact: v })} placeholder="مثال: تبرعك يرسم بسمة على وجه يتيم." />

            {/* Live preview */}
            {form.title && (
              <div className="rounded-xl border border-dashed border-gold/40 bg-gold/5 p-4">
                <div className="text-[11px] font-semibold text-muted-foreground mb-2">معاينة</div>
                <div className="flex items-center gap-3">
                  {(() => {
                    const preview = resolveCategory({ ...form, slug: form.slug || editingSlug || "preview" });
                    const Icon = preview.icon;
                    return (
                      <>
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-gold-foreground shadow-gold">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-display font-bold">{form.title}</div>
                          <div className="text-xs text-gold font-semibold">{form.short}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditorOpen(false)}>إلغاء</Button>
            <Button onClick={submit} className="bg-gradient-to-l from-gold to-amber-400 text-gold-foreground shadow-gold">
              {editingSlug ? "حفظ التعديلات" : "إضافة القسم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteSlug} onOpenChange={(v) => !v && setDeleteSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف قسم «{deletingCat?.title}»؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيختفي القسم من الموقع فوراً. الطلبات والتبرعات المرتبطة به تبقى محفوظة في السجلات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>تراجع</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              نعم، احذف القسم
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
