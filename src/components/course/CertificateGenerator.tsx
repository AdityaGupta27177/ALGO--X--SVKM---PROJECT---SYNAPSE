import { useRef, useMemo } from "react";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import confetti from "canvas-confetti";

export default function CertificateGenerator({ score }: { score: number }) {
  const { profile } = useAuth();

  const today = useMemo(() => new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), []);

  const certId = useMemo(() => `AX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, []);

  const downloadCertificate = () => {
    try {
      const W = 842; // A4 landscape width in pt
      const H = 595; // A4 landscape height in pt
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

      const studentName = profile?.display_name || "Student Name";

      // ── Colors ──
      const navy = [26, 42, 80] as const;      // Dark navy blue
      const gold = [178, 150, 90] as const;     // Elegant gold
      const darkText = [30, 30, 40] as const;
      const medText = [80, 80, 100] as const;
      const lightText = [140, 140, 160] as const;

      // ══════════════════════════════════════════════
      // 1. OUTER BORDER — thick navy frame
      // ══════════════════════════════════════════════
      pdf.setFillColor(...navy);
      pdf.rect(0, 0, W, H, "F"); // fill entire page navy

      // White inner area
      const m = 22; // outer margin
      pdf.setFillColor(255, 255, 255);
      pdf.rect(m, m, W - 2 * m, H - 2 * m, "F");

      // ══════════════════════════════════════════════
      // 2. INNER DECORATIVE BORDER — double line with pattern
      // ══════════════════════════════════════════════
      const m2 = 36;
      // Outer thin line
      pdf.setDrawColor(...navy);
      pdf.setLineWidth(1.5);
      pdf.rect(m2, m2, W - 2 * m2, H - 2 * m2);

      // Inner thin line
      const m3 = 42;
      pdf.setLineWidth(0.5);
      pdf.rect(m3, m3, W - 2 * m3, H - 2 * m3);

      // Decorative corner ornaments (L-shaped brackets at corners)
      const cLen = 40;
      const cOff = 30;
      const cW = 3;
      pdf.setLineWidth(cW);
      pdf.setDrawColor(...gold);

      // Top-left
      pdf.line(cOff, cOff, cOff + cLen, cOff);
      pdf.line(cOff, cOff, cOff, cOff + cLen);
      // Top-right
      pdf.line(W - cOff, cOff, W - cOff - cLen, cOff);
      pdf.line(W - cOff, cOff, W - cOff, cOff + cLen);
      // Bottom-left
      pdf.line(cOff, H - cOff, cOff + cLen, H - cOff);
      pdf.line(cOff, H - cOff, cOff, H - cOff - cLen);
      // Bottom-right
      pdf.line(W - cOff, H - cOff, W - cOff - cLen, H - cOff);
      pdf.line(W - cOff, H - cOff, W - cOff, H - cOff - cLen);

      // Subtle decorative dots along borders
      pdf.setFillColor(...gold);
      const dotR = 2;
      const dotSpacing = 20;
      // Top edge dots
      for (let x = cOff + cLen + 20; x < W - cOff - cLen - 20; x += dotSpacing) {
        pdf.circle(x, cOff, dotR, "F");
      }
      // Bottom edge dots
      for (let x = cOff + cLen + 20; x < W - cOff - cLen - 20; x += dotSpacing) {
        pdf.circle(x, H - cOff, dotR, "F");
      }
      // Left edge dots
      for (let y = cOff + cLen + 20; y < H - cOff - cLen - 20; y += dotSpacing) {
        pdf.circle(cOff, y, dotR, "F");
      }
      // Right edge dots
      for (let y = cOff + cLen + 20; y < H - cOff - cLen - 20; y += dotSpacing) {
        pdf.circle(W - cOff, y, dotR, "F");
      }

      // ══════════════════════════════════════════════
      // 3. HEADER — "CERTIFICATE"
      // ══════════════════════════════════════════════
      let yPos = 110;

      pdf.setFont("times", "bold");
      pdf.setFontSize(52);
      pdf.setTextColor(...navy);
      pdf.text("CERTIFICATE", W / 2, yPos, { align: "center" });

      // ── "OF ACHIEVEMENT" ──
      yPos += 38;
      pdf.setFontSize(18);
      pdf.setFont("times", "normal");
      pdf.setTextColor(...medText);
      pdf.text("OF ACHIEVEMENT", W / 2, yPos, { align: "center" });

      // ── Decorative divider line ──
      yPos += 18;
      const divW = 180;
      pdf.setDrawColor(...gold);
      pdf.setLineWidth(1.5);
      pdf.line(W / 2 - divW / 2, yPos, W / 2 + divW / 2, yPos);
      // Center diamond
      const dSize = 4;
      pdf.setFillColor(...gold);
      pdf.circle(W / 2, yPos, dSize, "F");
      // Small accent dots on divider ends
      pdf.circle(W / 2 - divW / 2 + 5, yPos, 1.5, "F");
      pdf.circle(W / 2 + divW / 2 - 5, yPos, 1.5, "F");

      // ══════════════════════════════════════════════
      // 4. "PROUDLY PRESENTED TO"
      // ══════════════════════════════════════════════
      yPos += 40;
      pdf.setFont("times", "italic");
      pdf.setFontSize(14);
      pdf.setTextColor(...lightText);
      pdf.text("PROUDLY PRESENTED TO", W / 2, yPos, { align: "center" });

      // ══════════════════════════════════════════════
      // 5. STUDENT NAME — large, elegant
      // ══════════════════════════════════════════════
      yPos += 50;
      pdf.setFont("times", "bolditalic");
      pdf.setFontSize(42);
      pdf.setTextColor(...darkText);
      pdf.text(studentName, W / 2, yPos, { align: "center" });

      // Underline below name
      yPos += 12;
      const nameWidth = Math.min(pdf.getTextWidth(studentName) + 60, 500);
      pdf.setDrawColor(...navy);
      pdf.setLineWidth(1);
      pdf.line(W / 2 - nameWidth / 2, yPos, W / 2 + nameWidth / 2, yPos);

      // ══════════════════════════════════════════════
      // 6. DESCRIPTION TEXT
      // ══════════════════════════════════════════════
      yPos += 36;
      pdf.setFont("times", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(...medText);
      pdf.text(
        "Has successfully completed the comprehensive course",
        W / 2, yPos, { align: "center" }
      );

      yPos += 28;
      pdf.setFont("times", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(...navy);
      pdf.text("INTRO TO C++ PROGRAMMING", W / 2, yPos, { align: "center" });

      yPos += 26;
      pdf.setFont("times", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(...medText);
      pdf.text(
        `with a final assessment score of ${score}% on the ALGO-X Synapse Platform.`,
        W / 2, yPos, { align: "center" }
      );

      // ── Second decorative divider ──
      yPos += 22;
      pdf.setDrawColor(...gold);
      pdf.setLineWidth(1);
      pdf.line(W / 2 - divW / 2, yPos, W / 2 + divW / 2, yPos);
      pdf.setFillColor(...gold);
      pdf.circle(W / 2, yPos, 3, "F");

      // ══════════════════════════════════════════════
      // 7. SEAL / BADGE — center bottom
      // ══════════════════════════════════════════════
      const sealCX = W / 2;
      const sealCY = yPos + 45;
      const sealR = 28;

      // Outer ring
      pdf.setDrawColor(...navy);
      pdf.setLineWidth(2.5);
      pdf.circle(sealCX, sealCY, sealR);

      // Inner ring
      pdf.setLineWidth(1);
      pdf.circle(sealCX, sealCY, sealR - 5);

      // Inner fill
      pdf.setFillColor(245, 245, 250);
      pdf.circle(sealCX, sealCY, sealR - 6, "F");

      // Seal text
      pdf.setFont("times", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(...navy);
      pdf.text("ALGO-X", sealCX, sealCY - 5, { align: "center" });
      pdf.setFontSize(6);
      pdf.text("SYNAPSE", sealCX, sealCY + 3, { align: "center" });

      // Star / badge icon
      pdf.setFillColor(...gold);
      pdf.circle(sealCX, sealCY + 12, 3, "F");

      // ══════════════════════════════════════════════
      // 8. FOOTER — Date, Cert ID, Signature
      // ══════════════════════════════════════════════
      const footerY = H - 80;
      const footerLineY = footerY - 10;
      const col1X = 140;
      const col3X = W - 140;

      // Date column
      pdf.setDrawColor(...navy);
      pdf.setLineWidth(0.8);
      pdf.line(col1X - 60, footerLineY, col1X + 60, footerLineY);

      pdf.setFont("times", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(...lightText);
      pdf.text("DATE", col1X, footerY + 14, { align: "center" });

      pdf.setFont("times", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(...darkText);
      pdf.text(today, col1X, footerLineY - 8, { align: "center" });

      // Signature column
      pdf.setDrawColor(...navy);
      pdf.line(col3X - 60, footerLineY, col3X + 60, footerLineY);

      pdf.setFont("times", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(...lightText);
      pdf.text("SIGNATURE", col3X, footerY + 14, { align: "center" });

      pdf.setFont("times", "italic");
      pdf.setFontSize(14);
      pdf.setTextColor(...darkText);
      pdf.text("AlgoX Synapse", col3X, footerLineY - 8, { align: "center" });

      // Certificate ID — bottom center
      pdf.setFont("courier", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...lightText);
      pdf.text(`Certificate ID: ${certId}`, W / 2, H - 40, { align: "center" });

      // ══════════════════════════════════════════════
      // SAVE
      // ══════════════════════════════════════════════
      pdf.save(`AlgoX_Cpp_Certificate_${studentName.replace(/\s+/g, '_')}.pdf`);

      // Celebration!
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.7 },
        colors: ['#EAB308', '#FFFFFF', '#1A2A50']
      });
    } catch (error) {
      console.error("Certificate generation failed:", error);
    }
  };

  return (
    <Button onClick={downloadCertificate} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 px-8 gap-2 shadow-lg shadow-yellow-500/20 transition-all hover:shadow-yellow-500/40 hover:scale-105">
      <Download size={18} /> Download Certificate
    </Button>
  );
}
