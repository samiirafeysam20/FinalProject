import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, Plus, X, Save, ArrowLeft } from 'lucide-react';
import { examAPI, questionAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const CreateExam = ({ onBack, onExamCreated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    duration: 60,
    totalPoints: 100,
    startTime: '',
    endTime: '',
    allowedAttempts: 1,
    randomizeQuestions: false,
    showResults: true,
    status: 'DRAFT'
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const questions = await questionAPI.getQuestions();
      setAvailableQuestions(questions || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionToggle = (question) => {
    setSelectedQuestions(prev => {
      const isSelected = prev.find(q => q.id === question.id);
      if (isSelected) {
        return prev.filter(q => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const examData = {
        ...formData,
        questions: selectedQuestions,
        totalPoints: selectedQuestions.reduce((sum, q) => sum + (q.points || 0), 0)
      };

      const newExam = await examAPI.createExam(examData);
      setSuccess('Exam created successfully!');
      
      if (onExamCreated) {
        onExamCreated(newExam);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        duration: 60,
        totalPoints: 100,
        startTime: '',
        endTime: '',
        allowedAttempts: 1,
        randomizeQuestions: false,
        showResults: true,
        status: 'DRAFT'
      });
      setSelectedQuestions([]);
      
    } catch (err) {
      setError('Error creating exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subjects = [...new Set(availableQuestions.map(q => q.subject).filter(Boolean))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <FileText className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                required
                placeholder="Enter exam title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="input-field"
                min="1"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field h-24 resize-none"
                placeholder="Enter exam description (optional)"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allowed Attempts
              </label>
              <input
                type="number"
                name="allowedAttempts"
                value={formData.allowedAttempts}
                onChange={handleInputChange}
                className="input-field"
                min="1"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="randomizeQuestions"
                  checked={formData.randomizeQuestions}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Randomize question order</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showResults"
                  checked={formData.showResults}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show results to students after submission</span>
              </label>
            </div>
          </div>
        </div>

        {/* Question Selection */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Questions ({selectedQuestions.length} selected)
          </h3>
          
          {availableQuestions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No questions available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create some questions first to add them to your exam.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {availableQuestions.map((question) => {
                const isSelected = selectedQuestions.find(q => q.id === question.id);
                return (
                  <div
                    key={question.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-primary-200 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleQuestionToggle(question)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {question.questionText || 'Question text not available'}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>Subject: {question.subject || 'N/A'}</span>
                          <span>Type: {question.type || 'N/A'}</span>
                          <span>Points: {question.points || 0}</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'border-primary-600 bg-primary-600' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || selectedQuestions.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Create Exam</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;