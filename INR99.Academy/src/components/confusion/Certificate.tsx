'use client';

import { useState } from 'react';

interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

interface CertificateDisplayProps {
  data: CertificateData;
  onClose: () => void;
}

export function CertificateDisplay({ data, onClose }: CertificateDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const certificateElement = document.getElementById('certificate-content');
      if (!certificateElement) return;

      // Create canvas from certificate element
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate-${data.certificateId}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Your Certificate</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Certificate Preview */}
        <div className="p-8 bg-slate-50">
          <div 
            id="certificate-content"
            className="bg-white p-12 shadow-lg mx-auto"
            style={{
              width: '800px',
              height: '566px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              position: 'relative'
            }}
          >
            {/* Border */}
            <div 
              style={{
                position: 'absolute',
                inset: '16px',
                border: '3px solid #1e3a8a',
                borderRadius: '8px'
              }}
            />
            <div 
              style={{
                position: 'absolute',
                inset: '20px',
                border: '1px solid #d97706',
                borderRadius: '6px'
              }}
            />

            {/* Content */}
            <div className="text-center h-full flex flex-col justify-center items-center relative z-10">
              {/* Logo */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-indigo-600">INR99</span>
                <span className="text-2xl text-slate-700 ml-2">Academy</span>
              </div>

              {/* Title */}
              <h1 
                className="text-4xl font-serif font-bold text-slate-900 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Certificate of Completion
              </h1>

              {/* Decorative line */}
              <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mb-6" />

              {/* Presented to */}
              <p className="text-lg text-slate-600 mb-2">This is to certify that</p>
              <h2 
                className="text-3xl font-semibold text-indigo-900 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {data.userName || 'Learner'}
              </h2>

              {/* Course completion */}
              <p className="text-lg text-slate-600 mb-2">has successfully completed</p>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                {data.courseName}
              </h3>

              {/* Stats */}
              <div className="flex items-center gap-8 mb-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Duration: 60 Minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>12 Lessons Completed</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between w-full max-w-md mt-8 pt-6 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">Date of Issue</p>
                  <p className="font-semibold text-slate-800">{data.completionDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">Certificate ID</p>
                  <p className="font-mono text-sm text-slate-600">{data.certificateId}</p>
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute bottom-4 right-6 opacity-10">
                <span className="text-6xl font-bold text-indigo-600">INR99</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="px-6 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Mini certificate preview for cards
export function CertificateBadge({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 rounded-full text-sm font-semibold hover:from-amber-500 hover:to-amber-600 transition-all shadow-sm hover:shadow-md"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Certificate Earned
    </button>
  );
}
