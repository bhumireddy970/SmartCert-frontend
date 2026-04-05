import React, { useState } from "react";
import {
  Loader,
  AlertCircle,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
const DocumentPreviewer = ({ document, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  if (!document) return null;
  const getResolvedUrl = (doc) => {
    let rawUrl = null;
    if (doc.cloudinaryUrl) rawUrl = doc.cloudinaryUrl;
    else if (doc.path) {
      rawUrl = doc.path.startsWith("http")
        ? doc.path
        : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${doc.path}`;
    }
    return rawUrl;
  };
  const url = getResolvedUrl(document);
  if (!url) {
    return (
      <div className="flex flex-col items-center gap-3 p-8 text-center bg-slate-50 w-full h-full justify-center">
        <AlertCircle size={40} className="text-yellow-600" />
        <p className="text-sm font-bold text-slate-900">No Document URL</p>
        <p className="text-xs text-slate-600">
          The server could not locate a robust path for this payload.
        </p>
      </div>
    );
  }
  const isPdf = url.toLowerCase().includes(".pdf");
  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setScale(1);
  return (
    <div className="w-full h-full relative bg-slate-200 flex flex-col overflow-hidden">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-slate-700/50">
        {!isPdf && (
          <>
            <button
              onClick={handleZoomOut}
              className="p-2.5 text-white hover:bg-slate-700 rounded-xl transition-colors tooltip"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <div className="text-white/80 font-medium text-sm min-w-[3rem] text-center select-none">
              {Math.round(scale * 100)}%
            </div>
            <button
              onClick={handleZoomIn}
              className="p-2.5 text-white hover:bg-slate-700 rounded-xl transition-colors tooltip"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <button
              onClick={handleResetZoom}
              className="p-2.5 text-white hover:bg-slate-700 rounded-xl transition-colors tooltip"
              title="Reset Zoom"
            >
              <Maximize size={20} />
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
          </>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-colors"
        >
          <Download size={18} /> Download
        </a>
      </div>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 backdrop-blur-sm z-20">
          <Loader size={40} className="text-indigo-600 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-600 animate-pulse">
            Loading Document...
          </p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-20 p-8 text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-lg font-black text-slate-900 mb-2">
            Display Error
          </h3>
          <p className="text-sm font-medium text-slate-500 mb-6 max-w-md">
            The file format or network policy prevents secure inline rendering.
          </p>
        </div>
      )}
      <div className="flex-1 overflow-auto w-full h-full flex p-0">
        <div
          className="m-auto transition-transform duration-200 ease-in-out origin-center flex items-center justify-center w-full h-full"
          style={{ transform: isPdf ? "scale(1)" : `scale(${scale})` }}
        >
          {isPdf ? (
            <object
              data={url}
              type="application/pdf"
              className="w-full h-full border-none"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            >
              <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-center p-8 bg-slate-50">
                <FileText size={48} className="text-slate-400" />
                <p className="text-slate-600 font-bold">
                  Your browser does not support inline PDFs.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-indigo-500 font-bold hover:underline"
                >
                  Click here to download the PDF instead.
                </a>
              </div>
            </object>
          ) : isImage ? (
            <img
              src={url}
              alt={document.name || "Document"}
              className="w-auto h-auto max-w-none shadow-xl border border-slate-200 bg-white m-6"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center">
              <FileText size={48} className="text-indigo-300" />
              <p className="font-black text-slate-800 text-lg">
                Format Not Supported
              </p>
              <p className="text-sm text-slate-500">
                Only PDFs and Images are natively viewable inline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DocumentPreviewer;
