# MedScope AI — گزارش اصلاح تصاویر Pathology

شاخهٔ `content/real-images-pilot` و مبنای `7d08af50908ec7f4e05e4aef26ef0e3359a60823` با درخواست منطبق بودند. مرجع اجرا [ممیزی حقوق و دقت علمی تصاویر](PATHOLOGY_IMAGE_RIGHTS_AUDIT.md) بود.

## فایل‌های تغییرکرده

- `src/data/pathology.json` — افزودن اعتبارنامهٔ ساختاریافته به ۲۶ تصویر و همگام‌سازی کپشن‌ها و متادیتای مرتبط.
- `src/shared/components/ImageViewer.jsx` — نمایش قابل‌استفادهٔ مجدد برای اعتبارنامه، منبع اصلی، پروندهٔ تصویر، مجوز، ارجاع مقاله و اطلاع پردازش. لینک‌های خارجی به HTTPS بدون نام کاربری یا گذرواژه محدودند و با `noopener noreferrer` باز می‌شوند.
- `src/shared/components/ImageViewer.css` — چیدمان چندخطی، شکست متن بلند و نشانگر فوکوس لینک‌ها.
- `PATHOLOGY_IMAGE_CORRECTIONS_IMPLEMENTATION_REPORT.md` — گزارش حاضر.

## اصلاحات به تفکیک تصویر

همهٔ ردیف‌ها اعتبارنامهٔ ساختاریافته با نام صاحب اثر یا انتساب موجود، لینک منبع اصلی و پروندهٔ تصویر، نام نسخه‌دار مجوز و لینک آن دارند. برای AML و میلوما، رنگ‌آمیزی تأییدنشده از متادیتای نمایشی حذف شد. برای Burkitt، بزرگ‌نمایی کلی حذف شد و نوع رنگ‌آمیزی و بزرگ‌نمایی H&E به پنل مربوط محدود شد. عنوان تشخیصی PDAC بر مبنای مقاله ثبت شد و توصیف دسموپلازی از این میدان حذف شد.

| فایل تصویر | کپشن یا تغییر علمی | انتساب |
| --- | --- | --- |
| `acute-leukemia-aml-all-photo.jpg` | میلوبلاست با میلهٔ آوئر (Auer rod) در اسمیر خون؛ سرنخ تمایز میلوئیدی. | Paulo Henrique Orlandi Mourao · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `alzheimer-disease-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Patho · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `amyloidosis-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Ed Uthman, MD · [CC BY 2.0 Generic](https://creativecommons.org/licenses/by/2.0/) |
| `bronchogenic-carcinoma-photo.jpg` | کارسینوم سلول کوچک با منشأ ریوی در نمونهٔ متاستاز دیوارهٔ قفسهٔ سینه؛ H&E. | Mikael Häggström, M.D. · [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) |
| `burkitt-lymphoma-photo.jpg` | لنفوم بورکیت، شکل ۲: پنل A الگوی Starry-sky در H&E ×200؛ پنل B رنگ‌آمیزی CD20، پنل C رنگ‌آمیزی c-MYC و پنل D هیبریداسیون درجا برای EBER. | Datta S, Gogia A and Mallick S · [CC BY 4.0 International](https://creativecommons.org/licenses/by/4.0/) · ارجاع مقاله افزوده شد. |
| `cholangiocarcinoma-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Nephron · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `chronic-lymphocytic-leukemia-photo.jpg` | اسمیر خون محیطی در CLL: لنفوسیت‌های بالغ با کروماتین متراکم و ترک‌خورده؛ Wright–Giemsa. | Gabriel Caponetti · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `colorectal-adenocarcinoma-polyps-photo.jpg` | آدنوکارسینوم کولورکتال با الگوی غده‌ای؛ H&E. | Mikael Häggström, M.D. · [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) |
| `copd-emphysema-chronic-bronchitis-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Department of Pathology, Calicut Medical College · [CC BY-SA 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) |
| `ependymoma-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Jensflorian · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `ewing-sarcoma-photo.jpg` | سارکوم یوینگ در نمونهٔ بافت ریه؛ سلول‌های گرد کوچک در رنگ‌آمیزی H&E. | Nephron · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `follicular-lymphoma-photo.jpg` | نمای کم‌بزرگ‌نمایی لنفوم سلول B کوچک با الگوی ندولار سازگار با لنفوم فولیکولار؛ H&E. | Nephron · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `gastric-carcinoma-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Nephron · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `gastritis-acute-chronic-photo.jpg` | بیوپسی معده با الگوی التهابی به نفع گاستریت مرتبط با H. pylori؛ H&E. | CoRus13 · [CC BY-SA 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) |
| `gestational-trophoblastic-disease-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Ed Uthman, MD · [CC BY 2.0 Generic](https://creativecommons.org/licenses/by/2.0/) |
| `graves-disease-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Librepath · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `hairy-cell-leukemia-photo.jpg` | لوسمی سلول مویی در مقطع مغز استخوان: سلول‌های کوچک با سیتوپلاسم روشن و هستهٔ گرد مرکزی (Fried-egg appearance)؛ H&E. | Nephron · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `hashimoto-thyroiditis-photo.jpg` | تیروئیدیت هاشیموتو در نمای کم‌بزرگ‌نمایی: ارتشاح لنفوسیتی و فولیکول‌های لنفوئیدی؛ H&E. | Librepath · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `iron-deficiency-anemia-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | Ed Uthman, MD · [CC BY 2.0 Generic](https://creativecommons.org/licenses/by/2.0/) |
| `medulloblastoma-photo.jpg` | مدولوبلاستوما با ساختارهای روزتی؛ H&E. | Jensflorian · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `multiple-myeloma-photo.jpg` | سلول‌های پلاسما در اسمیر مغز استخوان بیمار مبتلا به مولتیپل میلوما. | Dr Osaro Erhabor · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `oligodendroglioma-photo.jpg` | نمونهٔ تاریخی با برچسب الیگودندروگلیوما: هالهٔ روشن دور هسته (Fried-egg appearance) در H&E. تشخیص یکپارچه به تأیید جهش IDH و حذف هم‌زمان بازوهای کامل 1p/19q نیاز دارد. | Nephron · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `pancreatic-ductal-adenocarcinoma-photo.jpg` | آدنوکارسینوم مجرایی پانکراس (PDAC)؛ نمای بافت‌شناسی H&E از مقالهٔ Tayao و همکاران. | Michael Tayao et al. · [CC BY 4.0 International](https://creativecommons.org/licenses/by/4.0/) · ارجاع مقاله افزوده شد. |
| `papillary-thyroid-carcinoma-photo.jpg` | کپشن منبع‌پشتیبان حفظ شد. | KGH (original uploader) · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `parkinson-disease-photo.jpg` | اجسام لوی در نمونهٔ اتوپسی قشر فرونتال از مورد دمانس با اجسام لوی (DLB)؛ H&E. این مورفولوژی در بیماری پارکینسون نیز دیده می‌شود. | Jensflorian · [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/) |
| `pulmonary-tuberculosis-photo.jpg` | گرانولوم نکروزکننده در نمونهٔ گزارش‌شدهٔ سل ریوی؛ H&E. این نما به‌تنهایی عامل را تأیید نمی‌کند. | Yale Rosen · [CC BY-SA 2.0 Generic](https://creativecommons.org/licenses/by-sa/2.0/) |

## موارد باز و تصمیم‌های اجرایی

- هر ۲۶ رکورد همچنان **CONDITIONAL** است. در ۲۴ مورد، نسخهٔ محلی ۹۶۰ پیکسل عرض دارد و ابعاد آن با نسخهٔ کوچک‌تر Commons منطبق است. اندازهٔ فایل اصلی و محلی و نامشخص‌بودن جزئیات پردازش ثبت شد. برابری بایت با نسخهٔ ۹۶۰ پیکسلی و سابقهٔ کامل پردازش در دسترس نبود.
- فایل‌های PDAC و DLB از نظر هش با فایل اصلی Commons برابرند. این تطبیق در مورد PDAC منشأ دقیق پنل یا نحوهٔ استخراج آن از شکل مقاله را تعیین نمی‌کند. ارجاع مقاله به نام Tayao و همکاران اصلاح شد. تطبیق شمارهٔ پنل باز است.
- KGH برای تصویر تیروئید به‌عنوان بارگذار اصلی، بر اساس تاریخچهٔ فایل ثبت شد. تأیید مستقل پدیدآورنده همچنان باز است.
- برای موارد CC BY-SA، تعهد ShareAlike مربوط به توزیع اقتباس مشمول مجوز از همان تصویر است. داده‌ها دربارهٔ اقتباس‌بودن پردازش تأییدنشده حکمی صادر نمی‌کنند.
- تصاویر خارج از محدوده و موارد حل‌نشدهٔ آن‌ها در گزارش ممیزی باقی مانده‌اند.

## اعتبارسنجی

| بررسی | نتیجه |
| --- | --- |
| موضوعات Pathology | PASS، تعداد ۱۶۲. دقیقاً ۲۶ رکورد تغییر کرد و ۱۳۶ رکورد دیگر از جمله ۱۰ CLEARED، دو BLOCKED و یک UNVERIFIED یکسان‌اند. |
| بانک آزمون | PASS، ۲۹۳ شناسهٔ یکتا و محتوای یکسان با HEAD. |
| فایل‌های تصویر | PASS، هر ۳۹ JPEG حاضر است و وضعیت Git مسیر تصاویر تغییری نشان نمی‌دهد. |
| `npm test` | PASS، چهار تست موفق. |
| `npm run build` | PASS. هشدار قبلی اندازهٔ بستهٔ Vite باقی است. بستهٔ اصلی ۷۴۷٫۳۶ کیلوبایت بعد از minify است. |
| `git diff --check` | PASS. Git هشدار تبدیل آتی LF به CRLF را گزارش کرد. |
| رندر React در JSDOM | PASS، هر ۲۶ اعتبارنامه، لینک امن، RTL، ارجاع شکل Burkitt، نمایش قدیمی برای مورد خارج از محدوده و رد URL ناامن بررسی شدند. |
| مرورگر و موبایل | NOT VERIFIED. اجرای Chrome headless روی مسیر محلی خروجی DOM قابل تأیید نداد. رندر JSDOM صحت چیدمان بصری و تعامل در مرورگر را تعیین نمی‌کند. |

هیچ فایل stage نشد و commit، push، merge یا deployment انجام نشد.
