import imageCompression from "browser-image-compression";

/**
 * ضغط الصور قبل الرفع — يقلل الحجم بشكل كبير مع الحفاظ على جودة مقبولة.
 *
 * السلوك:
 * - PDF: يُعاد كما هو بدون تغيير
 * - صورة أصغر من 300KB: تُعاد كما هي
 * - الصور الكبيرة: تُضغط إلى WebP بحجم مستهدف ~300KB وأبعاد قصوى 1920px
 * - إذا زاد حجم الملف بعد الضغط: يُستخدم الملف الأصلي
 *
 * @param {File} file - الملف الأصلي
 * @param {object} [options] - خيارات إضافية (اختياري)
 * @returns {Promise<File>} الملف المضغوط (أو الأصلي إذا لم يكن بحاجة لضغط)
 */
export async function compressImage(file, options = {}) {
  // PDF — لا ضغط
  if (file.type === "application/pdf") {
    return file;
  }

  const defaults = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };

  const opts = { ...defaults, ...options };

  // لا حاجة للضغط إذا كان الحجم صغيراً أصلاً
  const fileSizeKB = file.size / 1024;
  if (fileSizeKB <= 300) {
    return file;
  }

  try {
    const compressed = await imageCompression(file, opts);

    // إذا زاد حجم الملف بعد الضغط — نعود للأصلي
    if (compressed.size >= file.size) {
      console.warn(
        `[compressImage] الضغط زاد حجم الملف (${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB)، استخدام الأصلي`
      );
      return file;
    }

    return compressed;
  } catch (err) {
    console.warn(`[compressImage] فشل الضغط: ${err.message}، استخدام الملف الأصلي`);
    return file;
  }
}