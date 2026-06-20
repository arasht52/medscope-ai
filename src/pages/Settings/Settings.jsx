import { useState } from "react";
import PageHeader from "./components/PageHeader";
import Card from "./components/Card";
import Button from "./components/Button";
import ConfirmModal from "./components/ConfirmModal";
import {
  APP_VERSION,
  resetProgress,
  resetFavorites,
} from "../../shared/lib/storage";
import "./Settings.css";

export default function Settings() {
  // "progress" | "favorites" | null
  const [pendingAction, setPendingAction] = useState(null);
  const [toast, setToast] = useState("");

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  }

  function handleConfirm() {
    if (pendingAction === "progress") {
      resetProgress();
      showToast("پیشرفت کوئیز با موفقیت پاک شد.");
    } else if (pendingAction === "favorites") {
      resetFavorites();
      showToast("علاقه‌مندی‌ها با موفقیت پاک شد.");
    }
    setPendingAction(null);
  }

  return (
    <div className="settings-page" dir="rtl">
      <PageHeader
        title="تنظیمات"
        subtitle="مدیریت اپلیکیشن MedScope AI"
      />

      <Card title="درباره MedScope AI">
        <p>
          MedScope AI یک اپلیکیشن آموزشی برای دانشجویان پزشکی است که بر
          Histology و Pharmacology تمرکز دارد. این محتوا صرفاً برای اهداف
          آموزشی است و نباید برای تشخیص، تجویز دارو یا تصمیمات درمانی
          استفاده شود.
        </p>
      </Card>

      <Card title="نسخه اپلیکیشن">
        <p className="settings-version">{APP_VERSION}</p>
      </Card>

      <Card title="پوسته (Theme)">
        <div className="settings-row">
          <span>حالت تیره (Dark Mode)</span>
          <span className="settings-badge">به‌زودی</span>
        </div>
        <Button variant="secondary" disabled>
          فعال‌سازی حالت تیره
        </Button>
      </Card>

      <Card title="بازنشانی داده‌ها">
        <div className="settings-reset-row">
          <Button
            variant="danger"
            onClick={() => setPendingAction("progress")}
          >
            بازنشانی پیشرفت کوئیز
          </Button>
        </div>
        <div className="settings-reset-row">
          <Button
            variant="danger"
            onClick={() => setPendingAction("favorites")}
          >
            بازنشانی علاقه‌مندی‌ها
          </Button>
        </div>
      </Card>

      {toast && <div className="settings-toast">{toast}</div>}

      <ConfirmModal
        open={pendingAction !== null}
        title="تایید بازنشانی"
        message={
          pendingAction === "progress"
            ? "تمام پیشرفت کوئیزهای شما حذف خواهد شد. این عمل قابل بازگشت نیست."
            : "تمام علاقه‌مندی‌های ذخیره‌شده حذف خواهد شد. این عمل قابل بازگشت نیست."
        }
        confirmLabel="بازنشانی"
        cancelLabel="انصراف"
        onConfirm={handleConfirm}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
