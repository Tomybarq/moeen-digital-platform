import { useState, useRef } from "react";
import { Upload, FileText, Paperclip, Trash2, X } from "lucide-react";
import { coreApi } from "@/api/coreClient";

export default function StepDocumentsUpload({ form, setForm }) {
  const [uploading, setUploading] = useState(false);
  const imgRef   = useRef(null);
  const excelRef = useRef(null);

  const handleUpload = async (files, type) => {
    if (!files?.length) return;
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      const { file_url } = await coreApi.integrations.Core.UploadFile({ file });
      uploaded.push({ url: file_url, name: file.name, type });
    }
    setForm(p => ({ ...p, documents: [...(p.documents || []), ...uploaded] }));
    setUploading(false);
  };

  const removeDoc = (url) =>
    setForm(p => ({ ...p, documents: p.documents.filter(d => d.url !== url) }));

  const images = (form.documents || []).filter(d => d.type === "image");
  const excels = (form.documents || []).filter(d => d.type === "excel");

  return (
    <div className="space-y-6">
      {/* Excel */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> استمارة الدراسة الاجتماعية (Excel)
        </h4>
        <div onClick={() => excelRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors">
          <input ref={excelRef} type="file" accept=".xlsx,.xls,.csv" multiple className="hidden"
            onChange={e => handleUpload(e.target.files, "excel")} />
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
            <Upload className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium">{uploading ? "جاري الرفع…" : "انقر لرفع ملف Excel"}</p>
          <p className="text-xs text-muted-foreground">.xlsx أو .xls أو .csv</p>
        </div>
        {excels.length > 0 && (
          <div className="mt-3 space-y-2">
            {excels.map(d => (
              <div key={d.url} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border">
                <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-sm flex-1 truncate">{d.name}</span>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">عرض</a>
                <button type="button" onClick={() => removeDoc(d.url)} className="text-muted-foreground hover:text-destructive">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images & docs */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-primary" /> صور الوثائق والمستندات الداعمة
        </h4>
        <div onClick={() => imgRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors">
          <input ref={imgRef} type="file" accept="image/*,.pdf" multiple className="hidden"
            onChange={e => handleUpload(e.target.files, "image")} />
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium">{uploading ? "جاري الرفع…" : "انقر لرفع صور الوثائق"}</p>
          <p className="text-xs text-muted-foreground">هوية وطنية، تقارير طبية، صور ميدانية…</p>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
            {images.map(d => (
              <div key={d.url} className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-muted">
                <img src={d.url} alt={d.name} className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = "none"; }} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-1.5">
                  <span className="text-white text-xs truncate flex-1">{d.name}</span>
                  <button type="button" onClick={() => removeDoc(d.url)}
                    className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}