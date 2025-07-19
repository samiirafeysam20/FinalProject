import React, { useState } from "react";
import { BookOpen, Save, ArrowLeft, Plus, X, Clock } from "lucide-react";
import { questionAPI } from "../../services/api";

const CreateQuestion = ({ question, onBack, onQuestionCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    question: question?.question || "",
    type: question?.type || "MULTIPLE_CHOICE",
    subject: question?.subject || "",
    difficulty: question?.difficulty || "MEDIUM",
    points: question?.points || 1,
    explanation: question?.explanation || "",
    options: question?.options
      ? question.options.map((opt) => ({ text: opt, isCorrect: false }))
      : [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
    correctAnswer: question?.correctAnswers?.[0] || "",
    tags: question?.tags?.join(", ") || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      ),
    }));
  };

  const handleCorrectAnswerChange = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => ({
        ...option,
        isCorrect: i === index,
      })),
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", isCorrect: false }],
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!formData.question.trim()) {
        throw new Error("Question text is required");
      }

      if (formData.type === "MULTIPLE_CHOICE") {
        const validOptions = formData.options.filter((opt) => opt.text.trim());
        if (validOptions.length < 2) {
          throw new Error(
            "At least 2 options are required for multiple choice questions"
          );
        }
        const correctOptions = validOptions.filter((opt) => opt.isCorrect);
        if (correctOptions.length !== 1) {
          throw new Error("Exactly one correct answer must be selected");
        }
      }

      if (formData.type === "SHORT_ANSWER" || formData.type === "ESSAY") {
        if (!formData.correctAnswer.trim()) {
          throw new Error("Correct answer or sample answer is required");
        }
      }

      // Transform data to match backend structure
      const questionData = {
        question: formData.question,
        type: formData.type,
        subject: formData.subject,
        difficulty: formData.difficulty,
        points: formData.points,
        // Backend expects options as List<String>
        options:
          formData.type === "MULTIPLE_CHOICE"
            ? formData.options
                .filter((opt) => opt.text.trim())
                .map((opt) => opt.text.trim())
            : null,
        // Backend expects correctAnswers as List<String>
        correctAnswers:
          formData.type === "MULTIPLE_CHOICE"
            ? formData.options
                .filter((opt) => opt.isCorrect && opt.text.trim())
                .map((opt) => opt.text.trim())
            : [formData.correctAnswer],
      };

      let result;
      if (question) {
        result = await questionAPI.updateQuestion(question.id, questionData);
      } else {
        result = await questionAPI.createQuestion(questionData);
      }

      setSuccess(`Question ${question ? "updated" : "created"} successfully!`);

      if (onQuestionCreated) {
        onQuestionCreated(result);
      }
    } catch (err) {
      setError(
        err.message || `Error ${question ? "updating" : "creating"} question`
      );
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionTypeFields = () => {
    switch (formData.type) {
      case "MULTIPLE_CHOICE":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                Answer Options
              </h4>
              <button
                type="button"
                onClick={addOption}
                className="btn-secondary text-sm flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Option</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={option.isCorrect}
                    onChange={() => handleCorrectAnswerChange(index)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(index, "text", e.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                    className="input-field flex-1"
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "TRUE_FALSE":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="trueFalseAnswer"
                  value="true"
                  checked={formData.correctAnswer === "true"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      correctAnswer: e.target.value,
                    }))
                  }
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>True</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="trueFalseAnswer"
                  value="false"
                  checked={formData.correctAnswer === "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      correctAnswer: e.target.value,
                    }))
                  }
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>False</span>
              </label>
            </div>
          </div>
        );

      case "SHORT_ANSWER":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer
            </label>
            <input
              type="text"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter the correct answer"
              required
            />
          </div>
        );

      case "ESSAY":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sample Answer / Grading Rubric
            </label>
            <textarea
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleInputChange}
              className="input-field h-32 resize-none"
              placeholder="Provide a sample answer or grading criteria"
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

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
          <BookOpen className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {question ? "Edit Question" : "Create New Question"}
          </h1>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Question Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Text *
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className="input-field h-24 resize-none"
                placeholder="Enter your question here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                  <option value="ESSAY">Essay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Mathematics, Science"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  className="input-field"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="algebra, equations, basic"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Answer Configuration */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Answer Configuration
          </h3>
          {renderQuestionTypeFields()}
        </div>

        {/* Explanation */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Explanation (Optional)
          </h3>
          <textarea
            name="explanation"
            value={formData.explanation}
            onChange={handleInputChange}
            className="input-field h-24 resize-none"
            placeholder="Provide an explanation for the correct answer..."
          />
        </div>

        {/* Preview */}
        {formData.question && (
          <div className="card bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Preview
            </h3>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  {formData.subject} • {formData.difficulty} • {formData.points}{" "}
                  points
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {formData.type.replace("_", " ")}
                </span>
              </div>

              <p className="font-medium text-gray-900 mb-3">
                {formData.question}
              </p>

              {formData.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-2">
                  {formData.options
                    .filter((opt) => opt.text.trim())
                    .map((option, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded border ${
                          option.isCorrect
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <span className="text-sm">
                          {String.fromCharCode(65 + index)}. {option.text}
                        </span>
                        {option.isCorrect && (
                          <span className="ml-2 text-green-600 text-xs font-medium">
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {formData.type === "TRUE_FALSE" && formData.correctAnswer && (
                <div className="text-sm text-gray-600">
                  Correct Answer:{" "}
                  <span className="font-medium">
                    {formData.correctAnswer === "true" ? "True" : "False"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onBack} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>{question ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{question ? "Update Question" : "Create Question"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
