import React, { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { examAPI, examAttemptAPI } from "../../services/api";
import DashboardCard from "./DashboardCard";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    completedExams: 0,
    upcomingExams: 0,
    averageScore: 0,
    totalAttempts: 0,
  });
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch upcoming exams
      const upcomingData = await examAPI.getUpcomingExams();
      setUpcomingExams(upcomingData || []);

      // Fetch student attempts for recent results
      const attemptsData = await examAttemptAPI.getStudentAttempts();
      setRecentResults(attemptsData || []);

      // Calculate stats
      const completedAttempts =
        attemptsData?.filter(
          (attempt) =>
            attempt.status === "COMPLETED" || attempt.status === "GRADED"
        ) || [];
      const averageScore =
        completedAttempts.length > 0
          ? Math.round(
              completedAttempts.reduce(
                (sum, attempt) => sum + (attempt.score || 0),
                0
              ) / completedAttempts.length
            )
          : 0;

      setStats({
        completedExams: completedAttempts.length,
        upcomingExams: upcomingData?.length || 0,
        averageScore: averageScore,
        totalAttempts: attemptsData?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.firstName || user?.username}!
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Completed Exams"
          value={stats.completedExams.toString()}
          icon={CheckCircle}
          color="green"
        />
        <DashboardCard
          title="Upcoming Exams"
          value={stats.upcomingExams.toString()}
          icon={Clock}
          color="yellow"
        />
        <DashboardCard
          title="Average Score"
          value={stats.averageScore > 0 ? `${stats.averageScore}%` : "N/A"}
          icon={BarChart3}
          color="blue"
        />
        <DashboardCard
          title="Total Attempts"
          value={stats.totalAttempts.toString()}
          icon={Trophy}
          color="purple"
        />
      </div>

      {/* Upcoming Exams and Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Exams
          </h3>
          {upcomingExams.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No upcoming exams
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any scheduled exams at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingExams.slice(0, 3).map((exam, index) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {exam.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {exam.startTime
                          ? new Date(exam.startTime).toLocaleString()
                          : "Time TBD"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exam.subject || "General"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Results
          </h3>
          {recentResults.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No results yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your exam results will appear here once you complete some exams.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResults.slice(0, 3).map((result, index) => {
                const scoreColor =
                  result.score >= 90
                    ? "text-green-600 bg-green-50"
                    : result.score >= 80
                    ? "text-blue-600 bg-blue-50"
                    : result.score >= 70
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-red-600 bg-red-50";
                return (
                  <div
                    key={result.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${scoreColor}`}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {result.exam?.title || "Exam"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Completed:{" "}
                        {result.submittedAt
                          ? new Date(result.submittedAt).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">
                        {result.score || 0}%
                      </span>
                      <p className="text-xs text-gray-500">
                        {result.score >= 90
                          ? "A"
                          : result.score >= 80
                          ? "B"
                          : result.score >= 70
                          ? "C"
                          : "D"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Performance Overview */}
      {recentResults.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Highest Score</h4>
              <p className="text-sm text-gray-600">
                {Math.max(...recentResults.map((r) => r.score || 0))}%
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Average Score</h4>
              <p className="text-sm text-gray-600">{stats.averageScore}%</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Completion Rate</h4>
              <p className="text-sm text-gray-600">
                {stats.totalAttempts > 0
                  ? Math.round(
                      (stats.completedExams / stats.totalAttempts) * 100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
