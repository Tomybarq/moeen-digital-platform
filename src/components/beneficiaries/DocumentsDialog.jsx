import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Paperclip, Upload, X, ZoomIn, Trash2, FileText, Image, AlertTriangle, Loader2 } from "lucide-react";
import { uploadFile } from "@/services/apiService";
import { validateDocumentFile, DOCUMENT_MAX_MB } from "@/lib/schemas";
import { compressImage } from "@/lib/imageCompressor";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentsDialog({ open, onOpenChange, beneficiary, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileStatuses, setFileStatuses] = useState([]); // { name, status, originalKB, compressedKB }
  const [compressionStats, setCompressionStats] = useState([]); // { name, originalKB, compressedKB, ratio }
  const inputRef = useRef(null);
  const docs = beneficiary?.documents || [];

  const isImage = (url) => /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url);

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploadError(null);
    setCompressionStats([]);

    const fileList = Array.from(files);

    // Validate type + size before any upload starts
    for (const file of fileList) {
      const err = validateDocumentFile(file);
      if (err) { setUploadError(err); return; }
    }

    setUploading(true);

    // Initialize statuses for all files
    setFileStatuses(fileList.map((f) => ({ name: f.name, status: "compressing", originalKB: 0, compressedKB: 0 })));

    const uploaded = [];
    const stats = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const originalKB = Math.round(file.size / 1024);

      // Update status → compressing
      setFileStatuses((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "compressing", originalKB } : s));

      // Compress
      const compressed = await compressImage(file);
      const compressedKB = Math.round(compressed.size / 1024);

      // Update status → uploading
      setFileStatuses((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "uploading", compressedKB } : s));

      // Upload
      const { file_url } = await uploadFile(compressed);
      uploaded.push(file_url);

      // Mark done + save stats
      setFileStatuses((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "done" } : s));

      stats.push({
        name: file.name,
        originalKB,
        compressedKB,
        ratio: compressedKB < originalKB ? `${(originalKB / 1024).toFixed(1)} → ${(compressedKB / 1024).toFixed(1)}` : null,
      });
      setCompressionStats([...stats]);
    }

    const newDocs = [...docs, ...uploaded];
    await onUpdate(beneficiary.id, { documents: newDocs });
    setUploading(false);
    setFileStatuses([]);
  };

  const handleRemove = async (url) => {
    const newDocs = docs.filter(d => d !== url);
    await onUpdate(beneficiary.id, { documents: newDocs });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Paperclip className="w-4 h-4 text-primary" />
            وثائق المستفيد — {beneficiary?.full_name}
          </DialogTitle>
        </DialogHeader>

        {/* Upload zone */}
        <div
          onClick={() => inputRef.current?.click()}
          className="mt-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors"
        >
          <input ref={inputRef} type="file" multiple accept="image/*,.pdf" className="hidden"
            onChange={e => handleUpload(e.target.files)} />
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            {uploading
              ? <Loader2 className="w-5 h-5 text-primary animate-spin" />
              : <Upload className="w-5 h-5 text-primary" />}
          </div>
          <p className="text-sm font-medium">{uploading ? "جاري الرفع…" : "انقر لرفع وثائق أو صور"}</p>
          <p className="text-xs text-muted-foreground">يدعم الصور (JPG, PNG, WebP) وملفات PDF — حتى {DOCUMENT_MAX_MB} ميجابايت</p>
        </div>

        {/* Per-file status badges during upload */}
        {uploading && fileStatuses.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {fileStatuses.map((fs, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border border-border">
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                <span className="text-xs truncate flex-1">{fs.name}</span>
                <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                  {fs.status === "compressing" && "جاري الضغط…"}
                  {fs.status === "uploading" && "جاري الرفع…"}
                  {fs.status === "done" && "✓"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Compression stats after upload */}
        {compressionStats.length > 0 && !uploading && (
          <div className="mt-2 space-y-1">
            {compressionStats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-xs text-muted-foreground truncate flex-1">{stat.name}</span>
                {stat.ratio ? (
                  <span className="text-xs text-primary font-medium shrink-0 whitespace-nowrap">
                    {stat.ratio} KB
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                    {stat.originalKB} KB (بدون تغيير)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {uploadError && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
            <p className="text-xs text-destructive">{uploadError}</p>
          </div>
        )}

        {/* Docs grid */}
        {docs.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 mt-2">
            <AnimatePresence>
              {docs.map((url, i) => (
                <motion.div key={url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} className="relative group rounded-xl overflow-hidden border border-border bg-muted aspect-square">
                  {isImage(url) ? (
                    <img src={url} alt={`وثيقة ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center truncate w-full">
                        {url.split("/").pop()?.slice(0, 15)}
                      </span>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {isImage(url) && (
                      <button onClick={() => setPreview(url)}
                        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center">
                        <ZoomIn className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center">
                      <Image className="w-3.5 h-3.5 text-white" />
                    </a>
                    <button onClick={() => handleRemove(url)}
                      className="w-7 h-7 rounded-full bg-red-500/70 hover:bg-red-500 flex items-center justify-center">
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">لا توجد وثائق مرفقة بعد</p>
        )}

        {/* Lightbox */}
        {preview && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
            <img src={preview} alt="معاينة" className="max-w-full max-h-full rounded-xl object-contain" />
            <button onClick={() => setPreview(null)} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}