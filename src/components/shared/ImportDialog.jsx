import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle2, X, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { entityBulkCreate, entityCreate } from "@/services/apiService";
import { sanitizeFormData } from "@/lib/validation";
import { validateImportFile, IMPORT_MAX_MB } from "@/lib/schemas";
import { ErrorLogger } from "@/lib/errorLogger";

const PHASE = { IDLE: "idle", PARSING: "parsing", IMPORTING: "importing", DONE: "done", ERROR: "error" };

/**
 * Async import dialog with:
 * - Chunked processing to avoid blocking the UI
 * - Live progress indicator
 * - Row-level error reporting
 * - Input sanitization before insert
 */
export default function ImportDialog({ open, onOpenChange, entityLabel, entityName, fieldMap }) {
  const [dragging, setDragging]   = useState(false);
  const [file, setFile]           = useState(null);
  const [phase, setPhase]         = useState(PHASE.IDLE);
  const [progress, setProgress]   = useState(0);
  const [result, setResult]       = useState(null); // { imported, skipped, errors }
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef(null);

  const reset = () => { setFile(null); setPhase(PHASE.IDLE); setProgress(0); setResult(null); setFileError(null); };

  const handleFile = (f) => {
    if (!f) return;
    const err = validateImportFile(f);
    if (err) { setFileError(err); setFile(null); return; }
    setFileError(null);
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // Parse CSV text into rows of objects
  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
    return lines.slice(1).map(line => {
      const cols = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g) || [];
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = (cols[i] || "").replace(/^"|"$/g, "").trim();
      });
      return obj;
    });
  };

  // Map raw CSV row -> entity fields using the provided fieldMap
  const mapRow = (row) => {
    if (!fieldMap) return sanitizeFormData(row);
    const mapped = {};
    for (const [entityField, csvHeader] of Object.entries(fieldMap)) {
      if (row[csvHeader] !== undefined) mapped[entityField] = row[csvHeader];
    }
    return sanitizeFormData(mapped);
  };

  // Bulk insert chunk size — large enough to minimise round-trips, small enough
  // to keep each request under the platform's payload limit (~500 rows).
  const BULK_CHUNK_SIZE = 100;

  const handleImport = async () => {
    if (!file) return;
    setPhase(PHASE.PARSING);
    setProgress(5);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        setPhase(PHASE.ERROR);
        setResult({ error: "الملف لا يحتوي على بيانات قابلة للاستيراد." });
        return;
      }

      setPhase(PHASE.IMPORTING);
      let imported = 0, skipped = 0;
      const errors = [];

      // Map + validate all rows first, separating valid from invalid
      const validRows = [];
      rows.forEach((row, idx) => {
        try {
          const data = mapRow(row);
          // Require at minimum a non-empty full_name or the first mapped field
          const values = Object.values(data);
          if (values.every(v => !v)) {
            skipped++;
            errors.push({ row: idx + 2, message: "صف فارغ" });
          } else {
            validRows.push({ rowNum: idx + 2, data });
          }
        } catch (err) {
          skipped++;
          errors.push({ row: idx + 2, message: err.message });
        }
      });

      // Bulk-insert in chunks using bulkCreate (single round-trip per chunk)
      for (let i = 0; i < validRows.length; i += BULK_CHUNK_SIZE) {
        const chunk = validRows.slice(i, i + BULK_CHUNK_SIZE);
        try {
          if (entityName) {
            await entityBulkCreate(entityName, chunk.map(r => r.data));
          }
          imported += chunk.length;
        } catch (err) {
          // If bulk fails, fall back to individual inserts for this chunk
          // to surface per-row errors without losing the whole batch
          for (const { rowNum, data } of chunk) {
            try {
              if (entityName) await entityCreate(entityName, data);
              imported++;
            } catch (rowErr) {
              skipped++;
              errors.push({ row: rowNum, message: rowErr.message });
              ErrorLogger.warn("Import row failed", { row: rowNum, error: rowErr.message });
            }
          }
        }
        // Update progress + yield to browser
        setProgress(5 + Math.round(((i + BULK_CHUNK_SIZE) / validRows.length) * 90));
        await new Promise(r => setTimeout(r, 0));
      }

      setProgress(100);
      setResult({ imported, skipped, errors: errors.slice(0, 10) });
      setPhase(PHASE.DONE);
    } catch (err) {
      ErrorLogger.error("Import failed", err);
      setPhase(PHASE.ERROR);
      setResult({ error: err.message || "حدث خطأ أثناء الاستيراد" });
    }
  };

  const isProcessing = phase === PHASE.PARSING || phase === PHASE.IMPORTING;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isProcessing) { reset(); onOpenChange(v); } }}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Upload className="w-4 h-4 text-primary" />
            استيراد {entityLabel}
          </DialogTitle>
          <DialogDescription>
            قم برفع ملف CSV يحتوي على بيانات {entityLabel}.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {phase === PHASE.DONE ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    تم الاستيراد: {result.imported} سجل
                  </p>
                  {result.skipped > 0 && (
                    <p className="text-xs text-muted-foreground">تم تخطي {result.skipped} سجل بسبب أخطاء</p>
                  )}
                </div>
              </div>
              {result.errors?.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 space-y-1">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> أخطاء في الصفوف:
                  </p>
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs text-muted-foreground">صف {e.row}: {e.message}</p>
                  ))}
                </div>
              )}
              <Button className="w-full cursor-pointer" onClick={() => { reset(); onOpenChange(false); }}>
                إغلاق
              </Button>
            </motion.div>
          ) : phase === PHASE.ERROR ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{result?.error || "فشل الاستيراد"}</p>
              </div>
              <Button variant="outline" className="w-full cursor-pointer" onClick={reset}>
                حاول مرة أخرى
              </Button>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); if (!isProcessing) setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !isProcessing && inputRef.current?.click()}
                className={`mt-2 rounded-xl border-2 border-dashed p-8 flex flex-col items-center gap-3 transition-colors ${
                  isProcessing ? "opacity-50 cursor-not-allowed" :
                  dragging ? "border-primary bg-primary/5 cursor-copy" :
                  "border-border hover:border-primary/50 hover:bg-muted/40 cursor-pointer"
                }`}
              >
                <input ref={inputRef} type="file" accept=".csv,.xlsx"
                  className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

                {isProcessing ? (
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <p className="text-sm font-medium text-foreground">
                        {phase === PHASE.PARSING ? "جاري تحليل الملف…" : "جاري الاستيراد…"}
                      </p>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">{progress}%</p>
                  </div>
                ) : file ? (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                    className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">اسحب الملف هنا أو انقر للاختيار</p>
                      <p className="text-xs text-muted-foreground mt-1">يدعم CSV و Excel (.xlsx) — حتى {IMPORT_MAX_MB} ميجابايت</p>
                    </div>
                  </>
                )}
              </div>

              {fileError && (
                <div className="mt-2 flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                  <p className="text-xs text-destructive">{fileError}</p>
                </div>
              )}

              <DialogFooter className="gap-2 pt-3">
                <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}
                  disabled={isProcessing} className="cursor-pointer">
                  <X className="w-4 h-4 ml-1" /> إلغاء
                </Button>
                <Button onClick={handleImport} disabled={!file || isProcessing} className="cursor-pointer gap-2">
                  {isProcessing
                    ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الاستيراد…</>
                    : <><Upload className="w-4 h-4" />استيراد البيانات</>}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}