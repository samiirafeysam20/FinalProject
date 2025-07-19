import React from 'react';
import { X, BookOpen, Clock, Target, Tag } from 'lucide-react';

const QuestionPreview = ({ question, onClose }) => {
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

  const renderAnswerOptions = () => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Answer Options:</h4>
            <div className="space-y-2">
              {question.options?.map((option, index) => {
                const isCorrect = question.correctAnswers?.includes(option);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      isCorrect
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                      </span>
                      {isCorrect && (
                        <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">
                          ✓ Correct Answer
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Answer Options:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border text-center ${
                question.correctAnswers?.includes('true')
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className="text-sm font-medium">True</span>
                {question.correctAnswers?.includes('true') && (
                  <div className="text-green-600 text-xs mt-1">✓ Correct</div>
                )}
              </div>
              <div className={`p-3 rounded-lg border text-center ${
                question.correctAnswers?.includes('false')
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <span className="text-sm font-medium">False</span>
                {question.correctAnswers?.includes('false') && (
                  <div className="text-green-600 text-xs mt-1">✓ Correct</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'SHORT_ANSWER':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Expected Answer:</h4>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-700">{question.correctAnswers?.[0] || 'No answer provided'}</p>
            </div>
          </div>
        );

      case 'ESSAY':
        return (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Sample Answer / Grading Rubric:</h4>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.correctAnswers?.[0] || 'No sample answer provided'}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-medium text-gray-900">Question Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Question Metadata */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(question.type)}`}>
              {question.type?.replace('_', ' ') || 'Unknown Type'}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty || 'Unknown Difficulty'}
            </span>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{question.points || 0} points</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>{question.subject || 'No Subject'}</span>
            </div>
            {question.createdAt && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Created {new Date(question.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Question Text */}
          <div className="card">
            <h4 className="font-medium text-gray-900 mb-3">Question:</h4>
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
              {question.question || 'No question text available'}
            </p>
          </div>

          {/* Answer Section */}
          <div className="card">
            {renderAnswerOptions()}
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="card">
              <h4 className="font-medium text-gray-900 mb-3">Explanation:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{question.explanation}</p>
            </div>
          )}

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium text-gray-900">Tags:</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Student View Simulation */}
          <div className="card bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Student View:</h4>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {question.subject} • {question.points} points
                </span>
                <span className="text-sm text-gray-500">
                  Question Type: {question.type?.replace('_', ' ')}
                </span>
              </div>
              
              <p className="font-medium text-gray-900 mb-4">{question.question}</p>
              
              {question.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2">
                  {question.options?.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="preview-answer"
                        className="text-primary-600 focus:ring-primary-500"
                        disabled
                      />
                      <span className="text-sm">{String.fromCharCode(65 + index)}. {option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'TRUE_FALSE' && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="radio" name="preview-tf" className="text-primary-600 focus:ring-primary-500" disabled />
                    <span className="text-sm">True</span>
                  </label>
                  <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="radio" name="preview-tf" className="text-primary-600 focus:ring-primary-500" disabled />
                    <span className="text-sm">False</span>
                  </label>
                </div>
              )}
              
              {question.type === 'SHORT_ANSWER' && (
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your answer here..."
                  disabled
                />
              )}
              
              {question.type === 'ESSAY' && (
                <textarea
                  className="input-field h-32 resize-none"
                  placeholder="Write your essay here..."
                  disabled
                />
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPreview;