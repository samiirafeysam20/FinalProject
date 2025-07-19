import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Search, Filter, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { questionAPI } from '../../services/api';
import CreateQuestion from './CreateQuestion';
import QuestionPreview from './QuestionPreview';

const QuestionBank = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, subjectFilter, typeFilter, difficultyFilter]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await questionAPI.getQuestions();
      console.log('Fetched questions:', data); // Debug log
      setQuestions(data || []);
    } catch (err) {
      console.error('Error fetching questions:', err); // Debug log
      setError(`Error loading questions: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(question =>
        question.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subjectFilter !== 'ALL') {
      filtered = filtered.filter(question => question.subject === subjectFilter);
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(question => question.type === typeFilter);
    }

    if (difficultyFilter !== 'ALL') {
      filtered = filtered.filter(question => question.difficulty === difficultyFilter);
    }

    setFilteredQuestions(filtered);
  };

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setShowCreateQuestion(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowCreateQuestion(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionAPI.deleteQuestion(questionId);
        setQuestions(questions.filter(q => q.id !== questionId));
      } catch (err) {
        setError('Error deleting question');
      }
    }
  };

  const handleDuplicateQuestion = async (question) => {
    try {
      const duplicatedQuestion = {
        ...question,
        question: `${question.question} (Copy)`,
        id: undefined
      };
      const newQuestion = await questionAPI.createQuestion(duplicatedQuestion);
      setQuestions([newQuestion, ...questions]);
    } catch (err) {
      setError('Error duplicating question');
    }
  };

  const handleQuestionCreated = (newQuestion) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? newQuestion : q));
    } else {
      setQuestions([newQuestion, ...questions]);
    }
    setShowCreateQuestion(false);
    setEditingQuestion(null);
  };

  const handlePreviewQuestion = (question) => {
    setSelectedQuestion(question);
    setShowPreview(true);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'bg-blue-100 text-blue-800';
      case 'TRUE_FALSE': return 'bg-green-100 text-green-800';
      case 'SHORT_ANSWER': return 'bg-yellow-100 text-yellow-800';
      case 'ESSAY': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const subjects = [...new Set(questions.map(q => q.subject).filter(Boolean))];

  if (loading) return <div className="p-6">Loading questions...</div>;

  if (showCreateQuestion) {
    return (
      <CreateQuestion
        question={editingQuestion}
        onBack={() => {
          setShowCreateQuestion(false);
          setEditingQuestion(null);
        }}
        onQuestionCreated={handleQuestionCreated}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
        </div>
        {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
          <button
            onClick={handleCreateQuestion}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Question</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="ALL">All Types</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="ESSAY">Essay</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="input-field"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{questions.length}</div>
          <div className="text-sm text-gray-600">Total Questions</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{subjects.length}</div>
          <div className="text-sm text-gray-600">Subjects</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {questions.filter(q => q.type === 'MULTIPLE_CHOICE').length}
          </div>
          <div className="text-sm text-gray-600">Multiple Choice</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {filteredQuestions.length}
          </div>
          <div className="text-sm text-gray-600">Filtered Results</div>
        </div>
      </div>

      {/* Questions List */}
      <div className="card">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {questions.length === 0 ? 'No questions found' : 'No questions match your filters'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {questions.length === 0 
                ? 'Get started by creating your first question.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {questions.length === 0 && (user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
              <button
                onClick={handleCreateQuestion}
                className="mt-4 btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Question</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {question.question || 'Question text not available'}
                      </h3>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(question.type)}`}>
                          {question.type?.replace('_', ' ') || 'Unknown'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>Subject: {question.subject || 'N/A'}</span>
                      <span>Points: {question.points || 0}</span>
                      {question.createdAt && (
                        <span>Created: {new Date(question.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>

                    {question.options && question.options.length > 0 && (
                      <div className="text-sm text-gray-500">
                        Options: {question.options.length} choices
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex items-center space-x-2">
                    <button
                      onClick={() => handlePreviewQuestion(question)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Preview question"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                      <>
                        <button
                          onClick={() => handleDuplicateQuestion(question)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicate question"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit question"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question Preview Modal */}
      {showPreview && selectedQuestion && (
        <QuestionPreview
          question={selectedQuestion}
          onClose={() => {
            setShowPreview(false);
            setSelectedQuestion(null);
          }}
        />
      )}
    </div>
  );
};

export default QuestionBank;