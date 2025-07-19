import React, { useEffect, useState } from "react";
import { Plus, FileText } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { examAPI, examAttemptAPI } from "../../services/api";
import CreateExam from "./CreateExam";

const Exams = () => {
  const [activeExams, setActiveExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [myExams, setMyExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState({});
  const [showCreateExam, setShowCreateExam] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError("");
      try {
        if (user?.role === "STUDENT") {
          const [activeData, upcomingData] = await Promise.all([
            examAPI.getActiveExams(),
            examAPI.getUpcomingExams(),
          ]);
          setActiveExams(activeData);
          setUpcomingExams(upcomingData);
        } else if (user?.role === "TEACHER" || user?.role === "ADMIN") {
          const myExamsData = await examAPI.getExams();
          setMyExams(myExamsData);
        }
      } catch (err) {
        setError("Error loading exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [user]);

  const handleStartExam = async (examId) => {
    setStarting((prev) => ({ ...prev, [examId]: true }));
    setError("");
    try {
      await examAttemptAPI.startExam(examId);
      // Optionally, redirect to exam page or refresh list
      setActiveExams((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, started: true } : e))
      );
    } catch (err) {
      setError("Error starting exam");
    } finally {
      setStarting((prev) => ({ ...prev, [examId]: false }));
    }
  };

  const handleExamCreated = (newExam) => {
    setMyExams((prev) => [newExam, ...prev]);
    setShowCreateExam(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="p-6">Loading exams...</div>;

  if (showCreateExam) {
    return (
      <CreateExam
        onBack={() => setShowCreateExam(false)}
        onExamCreated={handleExamCreated}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
        </div>
        {(user?.role === "TEACHER" || user?.role === "ADMIN") && (
          <button
            onClick={() => setShowCreateExam(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Exam</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Student View */}
      {user?.role === "STUDENT" && (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Exams
            </h2>
            {activeExams.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No active exams
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no exams available to take right now.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeExams.map((exam) => (
                  <div key={exam.id} className="card">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {exam.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Subject: {exam.subject}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Duration: {exam.duration} minutes</span>
                          <span>
                            Start:{" "}
                            {exam.startTime?.slice(0, 16).replace("T", " ")}
                          </span>
                          <span>
                            End: {exam.endTime?.slice(0, 16).replace("T", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-6">
                        {exam.started ? (
                          <span className="text-green-600 font-medium">
                            Started
                          </span>
                        ) : (
                          <button
                            className="btn-primary"
                            onClick={() => handleStartExam(exam.id)}
                            disabled={starting[exam.id]}
                          >
                            {starting[exam.id] ? "Starting..." : "Start Exam"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Exams
            </h2>
            {upcomingExams.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No upcoming exams
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any scheduled exams coming up.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="card">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {exam.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Subject: {exam.subject}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Duration: {exam.duration} minutes</span>
                          <span>
                            Start:{" "}
                            {exam.startTime?.slice(0, 16).replace("T", " ")}
                          </span>
                          <span>
                            End: {exam.endTime?.slice(0, 16).replace("T", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-6">
                        <span className="text-gray-500 font-medium">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Teacher/Admin View */}
      {(user?.role === "TEACHER" || user?.role === "ADMIN") && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            My Exams ({myExams.length})
          </h2>
          {myExams.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No exams created
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first exam.
              </p>
              <button
                onClick={() => setShowCreateExam(true)}
                className="mt-4 btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Exam</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myExams.map((exam) => (
                <div key={exam.id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {exam.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            exam.status
                          )}`}
                        >
                          {exam.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Subject: {exam.subject}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <span>Duration: {exam.duration} minutes</span>
                        <span>Questions: {exam.questions?.length || 0}</span>
                        <span>Points: {exam.totalPoints || 0}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          Start:{" "}
                          {exam.startTime?.slice(0, 16).replace("T", " ")}
                        </span>
                        <span>
                          End: {exam.endTime?.slice(0, 16).replace("T", " ")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-6 flex space-x-2">
                      <button className="btn-secondary text-sm">Edit</button>
                      <button className="btn-secondary text-sm">
                        View Results
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Exams;
