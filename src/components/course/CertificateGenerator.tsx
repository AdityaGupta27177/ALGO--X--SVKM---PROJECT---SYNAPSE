import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download, Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function CertificateGenerator({ score }: { score: number }) {
  const { profile } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    // Show the certificate temporarily for capture
    const element = certificateRef.current;
    element.style.display = "block";

    try {
      const canvas = await html2canvas(element, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`AlgoX_Cpp_Certificate_${profile?.display_name?.replace(/\s+/g, '_') || 'Student'}.pdf`);
    } catch (error) {
      console.error("Certificate generation failed:", error);
    } finally {
      element.style.display = "none";
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certId = `AX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <>
      <Button onClick={downloadCertificate} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-12 px-8 gap-2">
        <Download size={18} /> Download Certificate
      </Button>

      {/* Hidden Certificate Template */}
      <div 
        ref={certificateRef}
        style={{ 
          display: "none", 
          width: "1200px", 
          height: "850px", 
          padding: "60px",
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          backgroundColor: "white"
        }}
      >
        <div className="w-full h-full border-[15px] border-zinc-100 p-8 relative flex flex-col items-center text-center font-sans bg-white">
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-[10px] border-l-[10px] border-yellow-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-[10px] border-r-[10px] border-yellow-500"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[10px] border-l-[10px] border-yellow-500"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[10px] border-r-[10px] border-yellow-500"></div>

          {/* Logo / Branding */}
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-black text-white p-3 rounded-xl">
              <Award size={40} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-black">ALGO-X <span className="text-yellow-500">SYNAPSE</span></span>
          </div>

          <h1 className="text-6xl font-black text-black mb-4 uppercase tracking-tight">Certificate of Completion</h1>
          <p className="text-xl text-zinc-500 mb-12 italic">This officially certifies that</p>

          <h2 className="text-7xl font-bold text-black border-b-4 border-zinc-900 px-12 pb-4 mb-12 inline-block">
            {profile?.display_name || "Student Name"}
          </h2>

          <p className="text-2xl text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-16">
            Has successfully completed the comprehensive course 
            <br />
            <span className="text-black font-black text-3xl">INTRO TO C++ PROGRAMMING</span>
            <br />
            with a final assessment score of <span className="text-yellow-600 font-bold">{score}%</span>
          </p>

          <div className="flex justify-between w-full mt-auto px-12 pb-8">
            <div className="text-left">
              <p className="text-sm text-zinc-400 uppercase tracking-widest mb-1">Issue Date</p>
              <p className="text-xl font-bold text-black">{today}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-yellow-500 mb-2">
                <ShieldCheck size={48} />
              </div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-[0.3em]">Verified Achievement</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-zinc-400 uppercase tracking-widest mb-1">Certificate ID</p>
              <p className="text-xl font-bold text-black font-mono">{certId}</p>
            </div>
          </div>

          {/* Mock Signature */}
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2">
             <p className="font-serif text-3xl text-zinc-400 mb-2 italic">AlgoX Synapse Team</p>
             <div className="w-48 h-0.5 bg-zinc-200"></div>
             <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-2">Official Signature</p>
          </div>
        </div>
      </div>
    </>
  );
}
