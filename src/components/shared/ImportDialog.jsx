import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ImportDialog({ open, onOpenChange, entityLabel, onImport }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f && (f.name.endsWith(".csv") || f.name.endsWith(".xlsx"))) {
      setFile(f);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleConfirm = () => {
    if (file && onImport) onImport(file);
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setFile(null); onOpenChange(v); }}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Upload className="w-4 h-4 text-primary" />
            استيراد {entityLabel}
          </DialogTitle>
          <DialogDescription>
            قم برفع ملف CSV أو Excel يحتوي على بيانات {entityLabel}.
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`mt-2 rounded-xl border-2 border-dashed p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {file ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2">
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
                <p className="text-xs text-muted-foreground mt-1">يدعم CSV و Excel (.xlsx)</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => { setFile(null); onOpenChange(false); }} className="cursor-pointer">
            <X className="w-4 h-4 ml-1" /> إلغاء
          </Button>
          <Button onClick={handleConfirm} disabled={!file} className="cursor-pointer gap-2">
            <Upload className="w-4 h-4" /> استيراد البيانات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}