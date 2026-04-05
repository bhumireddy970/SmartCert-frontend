import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import DocumentPreviewer from "../../components/DocumentPreviewer";
import api from "../../api/axios";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Info,
  QrCode,
  Eye,
  X,
  Download,
  Loader,
  AlertCircle,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};
const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [reuploadingDocIndex, setReuploadingDocIndex] = useState(null);
  const [reuploadFile, setReuploadFile] = useState(null);
  const [isReuploadLoading, setIsReuploadLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const getSafePdfPreviewUrl = (url) => {
    if (!url) return url;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };
  const getFileType = (url) => {
    if (!url) return null;
    const urlLower = url.toLowerCase();
    if (urlLower.includes(".pdf")) return "pdf";
    if (
      urlLower.includes(".jpg") ||
      urlLower.includes(".jpeg") ||
      urlLower.includes(".png") ||
      urlLower.includes(".gif") ||
      urlLower.includes(".webp")
    ) {
      return "image";
    }
    return "document"; 
  };
  const downloadFile = (url, filename) => {
    if (!url) return;
    try {
      let downloadUrl = url;
      if (url.includes("cloudinary")) {
        if (!url.includes("fl_attachment")) {
          downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");
        }
      }
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "document";
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };
  const fetchApplication = async () => {
    try {
      const res = await api.get(`/api/student/applications/${id}`);
      setApplication(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleReuploadDocument = async (docIndex) => {
    if (!reuploadFile) {
      toast.error("Please select a file to upload");
      return;
    }
    setIsReuploadLoading(true);
    const formData = new FormData();
    formData.append("document", reuploadFile);
    try {
      await api.put(
        `/api/student/applications/${id}/reupload-document/${docIndex}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success("Document re-uploaded successfully!");
      setReuploadingDocIndex(null);
      setReuploadFile(null);
      await fetchApplication();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to re-upload document");
    } finally {
      setIsReuploadLoading(false);
    }
  };
  useEffect(() => {
    fetchApplication();
  }, [id]);
  if (!application)
    return (
      <div className="p-20 text-center font-bold text-slate-400 animate-pulse">
        Accessing Cryptographic Arrays...
      </div>
    );
  const isCompleted =
    application.status === "Completed" ||
    application.status === "Ready for Collection";
  const isRejected = application.status.includes("Reject");
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      <motion.div variants={itemVariants}>
        <Link
          to="/student/applications"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Return to Directory
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {application.certificateType.name}
            </h1>
            <p className="text-slate-500 font-medium font-mono text-xs mt-2 uppercase tracking-widest">
              ID: {application._id}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${isCompleted ? "bg-emerald-50 border-emerald-200 text-emerald-700" : isRejected ? "bg-red-50 border-red-200 text-red-700" : "bg-yellow-50 border-yellow-200 text-yellow-700"}`}
          >
            {application.status}
          </span>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-[2rem]">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8 flex items-center gap-2">
              <Clock className="text-indigo-600" /> Routing Audit Trail
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {application.history.map((h, i) => (
                <div
                  key={i}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">
                    {h.status.includes("Reject") ? (
                      <XCircle size={16} />
                    ) : h.status.includes("Completed") ? (
                      <CheckCircle size={16} />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900 text-sm">
                        {h.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                        {new Date(h.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {h.comments && (
                      <p className="text-xs text-slate-500 font-medium mt-2">
                        {h.comments}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-8 rounded-[2rem]">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
              <FileText className="text-indigo-600" /> Provided Payloads
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {application.documents.map((doc, i) => (
                <div
                  key={i}
                  className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedDoc(doc);
                      setIsPreviewLoading(true);
                      setPreviewError(null);
                    }}
                    className="w-full text-left hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group p-2 -m-2 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                        {doc.name}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${doc.status === "Verified" ? "bg-emerald-100 text-emerald-700" : doc.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    {doc.feedback && (
                      <p className="text-[10px] font-bold text-red-600 mt-2 bg-red-50 p-2 rounded-lg">
                        {doc.feedback}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-1 text-indigo-600 text-xs font-bold">
                      <Eye size={14} /> View Document
                    </div>
                  </button>
                  {doc.status === "Rejected" && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      {reuploadingDocIndex === i ? (
                        <div className="space-y-3">
                          <input
                            type="file"
                            onChange={(e) =>
                              setReuploadFile(e.target.files?.[0] || null)
                            }
                            className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReuploadDocument(i)}
                              disabled={!reuploadFile || isReuploadLoading}
                              className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              {isReuploadLoading ? (
                                <>
                                  <Loader size={12} className="animate-spin" />{" "}
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload size={12} /> Submit
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setReuploadingDocIndex(null);
                                setReuploadFile(null);
                              }}
                              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReuploadingDocIndex(i)}
                          className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Upload size={12} /> Re-upload Document
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="space-y-6">
          {application.appointmentDetails?.qrCodeUrl && (
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              <QrCode size={32} className="text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-black tracking-tight mb-2">
                Collection Pass
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-6">
                Scan at administrative desk.
              </p>
              <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto group-hover:scale-105 transition-transform">
                <img
                  src={application.appointmentDetails.qrCodeUrl}
                  alt="QR Secure Pass"
                  className="w-32 h-32"
                />
              </div>
              <div className="mt-6 text-left bg-white/10 p-4 rounded-xl backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">
                  Time Target
                </p>
                <p className="text-sm font-bold">
                  {new Date(
                    application.appointmentDetails.date,
                  ).toLocaleString()}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1 mt-3">
                  Node Location
                </p>
                <p className="text-sm font-bold">
                  {application.appointmentDetails.location}
                </p>
              </div>
            </div>
          )}
          <div className="glass-card p-6 rounded-[2rem]">
            <h3 className="text-sm font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <Info size={16} className="text-indigo-600" /> Metadata
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Instantiation
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {new Date(application.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Current Node Target
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {application.certificateType.workflow[
                    application.currentStep
                  ] || "Terminal"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[95vw] h-[95vh] flex flex-col border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center shrink-0">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Eye size={16} className="text-indigo-400" /> Document Preview
              </span>
              <button
                onClick={() => {
                  setSelectedDoc(null);
                  setPreviewError(null);
                  setIsPreviewLoading(false);
                }}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-300" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex bg-gradient-to-br from-slate-50 to-slate-100 relative">
              <DocumentPreviewer document={selectedDoc} />
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-600 truncate">
                  {selectedDoc.name}
                </p>
                {selectedDoc.status && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Status: {selectedDoc.status}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default ApplicationDetails;
