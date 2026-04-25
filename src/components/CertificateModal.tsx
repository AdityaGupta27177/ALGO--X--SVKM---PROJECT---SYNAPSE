import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Linkedin, ArrowLeft, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CertificateModal({ open, onOpenChange }: CertificateModalProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [certId] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return `CGDA-PONG-2026-${id}`;
  });
  const [downloading, setDownloading] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (open && !firedRef.current) {
      firedRef.current = true;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.4 } });
    }
    if (!open) firedRef.current = false;
  }, [open]);

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const el = document.getElementById("certificate-card");
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#111111" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, w, h);
      pdf.save("certificate-pong.pdf");
    } finally {
      setDownloading(false);
    }
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, "_blank");
  };

  const userName = profile?.display_name ?? "Student";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-card p-0 sm:rounded-2xl">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <CheckCircle className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Congratulations!</h2>
          <p className="mt-1 text-muted-foreground">You have completed the Pong test</p>
        </div>

        <div id="certificate-card" className="mx-6 rounded-xl border border-border bg-[#111111] p-8">
          <p className="text-xs text-muted-foreground">C++ Game Dev Academy</p>
          <h3 className="mt-4 text-2xl font-bold text-foreground">Certificate of Completion</h3>
          <p className="mt-4 text-sm text-muted-foreground">This certifies that</p>
          <p className="mt-1 text-xl font-bold text-primary">{userName}</p>
          <p className="mt-3 text-sm text-muted-foreground">has successfully completed</p>
          <p className="mt-1 text-lg font-semibold text-foreground">Pong — C++ Game Development</p>

          <div className="mt-6 flex justify-center gap-4">
            {[
              { label: "Score", value: "94/100" },
              { label: "Time", value: "38 min" },
              { label: "Grade", value: "Distinction" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-center">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
            <span>Issued: {today}</span>
            <span>{certId}</span>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">C++ Game Dev Academy — Verified</p>
        </div>

        <div className="flex flex-col gap-2 p-6 sm:flex-row">
          <Button onClick={handleDownload} disabled={downloading} className="flex-1 bg-primary hover:bg-primary/90">
            {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleLinkedIn} className="flex-1">
            <Linkedin className="mr-2 h-4 w-4" /> Share on LinkedIn
          </Button>
          <Button variant="ghost" onClick={() => { onOpenChange(false); navigate("/dashboard"); }} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
