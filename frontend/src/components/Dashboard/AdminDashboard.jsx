import React, { useEffect, useState } from 'react';
import { Users, FileText, BookOpen, BarChart3, TrendingUp, Clock } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsData, activityData] = await Promise.all([
          adminAPI.getOverviewStats(),
          adminAPI.getActivity()
        ]);
        setStats(statsData);
        setActivity(activityData);
      } catch (err) {
        setError('Error loading admin dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Loading admin dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
        />
        <DashboardCard
          title="Active Exams"
          value={stats.activeExams}
          icon={FileText}
          color="green"
        />
        <DashboardCard
          title="Question Bank"
          value={stats.questionBank}
          icon={BookOpen}
          color="purple"
        />
        <DashboardCard
          title="Completion Rate"
          value={stats.completionRate + '%'}
          icon={BarChart3}
          color="indigo"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Students</span>
              <span className="text-sm font-medium text-gray-900">{stats.students}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Teachers</span>
              <span className="text-sm font-medium text-gray-900">{stats.teachers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Administrators</span>
              <span className="text-sm font-medium text-gray-900">{stats.admins}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Total Users</span>
                <span className="text-sm font-bold text-primary-600">{stats.totalUsers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activity.length === 0 ? (
              <div>No recent activity.</div>
            ) : (
              activity.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'exam' ? 'bg-green-100' : item.type === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                    {item.type === 'exam' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {item.type === 'user' && <Users className="w-4 h-4 text-blue-600" />}
                    {item.type === 'question' && <BookOpen className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.message}</p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Users</h4>
            <p className="text-sm text-gray-600">Add, edit, or remove users</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FileText className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Exam</h4>
            <p className="text-sm text-gray-600">Set up a new examination</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">View Reports</h4>
            <p className="text-sm text-gray-600">Analyze system performance</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;