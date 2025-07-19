import React, { useEffect, useState } from 'react';
import { FileText, BookOpen, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { examAPI, questionAPI, userAPI, examAttemptAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myExams: 0,
    questionsCreated: 0,
    totalStudents: 0,
    pendingGrading: 0
  });
  const [recentExams, setRecentExams] = useState([]);
  const [pendingGrading, setPendingGrading] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch teacher's exams
      const examsData = await examAPI.getExams();
      setRecentExams(examsData || []);

      // Fetch teacher's questions
      const questionsData = await questionAPI.getQuestions();

      // Fetch total students
      const studentsData = await userAPI.getUsersByRole('STUDENT');

      // Fetch pending grading
      const pendingData = await examAttemptAPI.getPendingGrading();
      setPendingGrading(pendingData || []);

      setStats({
        myExams: examsData?.length || 0,
        questionsCreated: questionsData?.length || 0,
        totalStudents: studentsData?.length || 0,
        pendingGrading: pendingData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = () => {
    navigate('/exams');
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.firstName || user?.username}!
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="My Exams"
          value={stats.myExams.toString()}
          icon={FileText}
          color="blue"
        />
        <DashboardCard
          title="Questions Created"
          value={stats.questionsCreated.toString()}
          icon={BookOpen}
          color="green"
        />
        <DashboardCard
          title="Total Students"
          value={stats.totalStudents.toString()}
          icon={Users}
          color="purple"
        />
        <DashboardCard
          title="Pending Grading"
          value={stats.pendingGrading.toString()}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Recent Exams and Grading Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Exams</h3>
          {recentExams.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No exams created</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first exam to get started.
              </p>
              <button 
                onClick={handleCreateExam}
                className="mt-4 btn-primary text-sm"
              >
                Create Exam
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExams.slice(0, 3).map((exam) => {
                const getStatusColor = (status) => {
                  switch (status) {
                    case 'PUBLISHED': return 'bg-green-100 text-green-800';
                    case 'DRAFT': return 'bg-blue-100 text-blue-800';
                    case 'COMPLETED': return 'bg-gray-100 text-gray-800';
                    case 'ARCHIVED': return 'bg-purple-100 text-purple-800';
                    default: return 'bg-yellow-100 text-yellow-800';
                  }
                };

                return (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{exam.title}</h4>
                      <p className="text-sm text-gray-600">
                        {exam.endTime ? `Due: ${new Date(exam.endTime).toLocaleDateString()}` : 'No due date'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exam.status)}`}>
                      {exam.status || 'DRAFT'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Grading Queue */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading Queue</h3>
          {pendingGrading.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending grading</h3>
              <p className="mt-1 text-sm text-gray-500">
                All submissions have been graded.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingGrading.slice(0, 3).map((attempt) => (
                <div key={attempt.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{attempt.exam?.title || 'Exam'}</h4>
                    <p className="text-sm text-gray-600">
                      Student: {attempt.student?.firstName} {attempt.student?.lastName}
                    </p>
                  </div>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Grade Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/exams')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Exam</h4>
            <p className="text-sm text-gray-600">Set up a new examination</p>
          </button>
          <button 
            onClick={() => navigate('/questions')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <BookOpen className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Questions</h4>
            <p className="text-sm text-gray-600">Build your question bank</p>
          </button>
          <button 
            onClick={() => navigate('/results')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Clock className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Grade Submissions</h4>
            <p className="text-sm text-gray-600">Review student answers</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;