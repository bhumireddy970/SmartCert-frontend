import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import DocumentPreviewer from "../../components/DocumentPreviewer";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Search,
  Clock,
  FileText,
  Send,
  Calendar,
  MapPin,
  Eye,
  Check,
  X,
  Download,
  Loader,
  AlertCircle,
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
const ApplicationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [application, setApplication] = useState(null);
  const [comments, setComments] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docFeedback, setDocFeedback] = useState("");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [showScheduleAppointmentModal, setShowScheduleAppointmentModal] =
    useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleLocation, setScheduleLocation] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showDocPreviewModal, setShowDocPreviewModal] = useState(false);
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
      const res = await api.get(`/api/officer/applications/${id}`);
      setApplication(res.data);
    } catch (err) {
      console.error("Error fetching application");
    }
  };
  useEffect(() => {
    fetchApplication();
  }, [id]);
  const handleDocumentAction = async (action, docId) => {
    try {
      if (action === "reject" && !docFeedback)
        return toast.error("Feedback inherently required for rejection.");
      await api.put(
        `/api/officer/applications/${application._id}/verify-document/${docId}`,
        { action, feedback: docFeedback },
      );
      setDocFeedback("");
      fetchApplication();
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction failed");
    }
  };
  const handleApplicationAction = async (action) => {
    try {
      const payload = { action, comments };
      let newStatus = null;
      if (action === "reject") {
        payload.comments = rejectionReason;
      }
      if (action === "approve") {
        const template = application.certificateType.workflow;
        if (application.currentStep + 1 >= template.length) {
          if (!appointmentDate || !appointmentLocation)
            return setShowAppointmentModal(true);
          payload.appointmentDate = appointmentDate;
          payload.appointmentLocation = appointmentLocation;
          newStatus = "Ready for Collection";
        } else {
          newStatus = "Pending";
        }
      }
      await api.put(
        `/api/officer/applications/${application._id}/status`,
        payload,
      );
      if (action === "reject" || newStatus === "Ready for Collection") {
        navigate("/officer");
      } else {
        await fetchApplication();
        if (action === "schedule") {
          toast.success("Appointment scheduled successfully!");
          setShowScheduleAppointmentModal(false);
          setScheduleDate("");
          setScheduleLocation("");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Transaction logically failed.");
      setShowAppointmentModal(false);
    }
  };
  if (!application)
    return (
      <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs animate-pulse">
        Mounting Review Canvas...
      </div>
    );
  const isComplete =
    application.status === "Completed" ||
    application.status === "Ready for Collection";
  const isRejected = application.status.includes("Reject");
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1400px] mx-auto px-4 pb-12 flex flex-col h-[calc(100vh-140px)]"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Link
          to="/officer"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Return to Queue
        </Link>
        <div className="flex justify-between items-end bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${isComplete ? "bg-emerald-50 border-emerald-200 text-emerald-700" : isRejected ? "bg-red-50 border-red-200 text-red-700" : "bg-yellow-50 border-yellow-200 text-yellow-700"}`}
              >
                {application.status}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                ID: {application._id}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {application.certificateType.name}
            </h1>
            <p className="text-sm font-bold text-slate-500 mt-2">
              Target Student:{" "}
              <span className="text-slate-900">{application.student.name}</span>
            </p>
          </div>
          {!isComplete && !isRejected && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowScheduleAppointmentModal(true)}
                className="px-5 py-3 bg-blue-50 border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all flex items-center gap-2 outline-none focus:ring-4 focus:ring-blue-100"
              >
                <Calendar size={18} /> Schedule Meeting
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-5 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-red-200 hover:text-red-600 transition-all flex items-center gap-2 outline-none focus:ring-4 focus:ring-slate-100"
              >
                <XCircle size={18} /> Reject
              </button>
              <button
                onClick={() => handleApplicationAction("approve")}
                className="px-5 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 outline-none focus:ring-4 focus:ring-indigo-100"
              >
                <CheckCircle size={18} /> Approve Target
              </button>
            </div>
          )}
        </div>
      </motion.div>
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 justify-center">
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl shrink-0 flex flex-col gap-6 min-h-0 overflow-y-auto pr-2 custom-scrollbar"
        >
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-sm font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <FileText size={16} className="text-indigo-600" /> Submitted
              Payloads
            </h3>
            <div className="space-y-3">
              {application.documents.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all ${selectedDoc?._id === doc._id ? "border-indigo-500 bg-indigo-50/50 shadow-sm" : "border-slate-200 bg-white hover:border-indigo-300"}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-900 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {doc.name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${doc.status === "Verified" ? "bg-emerald-100 text-emerald-700" : doc.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDocPreviewModal(doc);
                        setIsPreviewLoading(true);
                        setPreviewError(null);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Eye size={14} /> View
                    </button>
                  </div>
                  {selectedDoc?._id === doc._id &&
                    doc.status !== "Verified" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-indigo-100 space-y-3"
                      >
                        <input
                          type="text"
                          placeholder="Rejection reasoning securely appended..."
                          className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                          value={docFeedback}
                          onChange={(e) => setDocFeedback(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleDocumentAction("verify", doc._id)
                            }
                            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                          >
                            <Check size={14} /> Verify
                          </button>
                          <button
                            onClick={() =>
                              handleDocumentAction("reject", doc._id)
                            }
                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </motion.div>
                    )}
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-sm font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <Send size={16} className="text-indigo-600" /> Append Node
              Instructions
            </h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none resize-none"
              placeholder="Attach optional directives seamlessly traversing to the next logical vector..."
            />
          </div>
        </motion.div>
      </div>
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Final Logical Sequence
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
              Execute Certificate Issuance Sequence
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Calendar size={14} /> Target Timestamp
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <MapPin size={14} /> Access Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Administrative Block A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  value={appointmentLocation}
                  onChange={(e) => setAppointmentLocation(e.target.value)}
                />
              </div>
              <div className="pt-6 flex gap-3">
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  className="flex-1 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-colors outline-none focus:ring-4 focus:ring-slate-100"
                >
                  Halt
                </button>
                <button
                  onClick={() => handleApplicationAction("approve")}
                  className="flex-[2] py-3 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl font-black shadow-sm transition-all outline-none focus:ring-4 focus:ring-indigo-100"
                >
                  Finalize Encryption
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Reject Application
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
              Provide a reason for rejection
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Rejection Reason
                </label>
                <textarea
                  placeholder="Explain why the application is being rejected..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none transition-all resize-none h-24"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="pt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="flex-1 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-colors outline-none focus:ring-4 focus:ring-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      alert("Please provide a rejection reason");
                      return;
                    }
                    handleApplicationAction("reject");
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="flex-[2] py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black shadow-sm transition-all outline-none focus:ring-4 focus:ring-red-100"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDocPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[95vw] h-[95vh] flex flex-col border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center shrink-0">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Eye size={16} className="text-indigo-400" /> Document Preview
              </span>
              <button
                onClick={() => {
                  setShowDocPreviewModal(false);
                  setPreviewError(null);
                  setIsPreviewLoading(false);
                }}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-300" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex bg-gradient-to-br from-slate-50 to-slate-100 relative">
              <DocumentPreviewer document={showDocPreviewModal} />
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-600 truncate">
                  {showDocPreviewModal.name}
                </p>
                {showDocPreviewModal.status && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Status: {showDocPreviewModal.status}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showScheduleAppointmentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Schedule Meeting
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
              Set meeting details for applicant
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Calendar size={14} /> Meeting Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <MapPin size={14} /> Meeting Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Office Room 101"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  value={scheduleLocation}
                  onChange={(e) => setScheduleLocation(e.target.value)}
                />
              </div>
              <div className="pt-6 flex gap-3">
                <button
                  onClick={() => setShowScheduleAppointmentModal(false)}
                  className="flex-1 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-colors outline-none focus:ring-4 focus:ring-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!scheduleDate || !scheduleLocation) {
                      toast.error("Please fill in all fields");
                      return;
                    }
                    try {
                      await api.put(
                        `/api/officer/applications/${application._id}/status`,
                        {
                          action: "schedule",
                          appointmentDate: scheduleDate,
                          appointmentLocation: scheduleLocation,
                        },
                      );
                      toast.success("Meeting scheduled successfully!");
                      setShowScheduleAppointmentModal(false);
                      setScheduleDate("");
                      setScheduleLocation("");
                      fetchApplication();
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message ||
                          "Failed to schedule meeting",
                      );
                    }
                  }}
                  className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-sm transition-all outline-none focus:ring-4 focus:ring-blue-100"
                >
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default ApplicationReview;
