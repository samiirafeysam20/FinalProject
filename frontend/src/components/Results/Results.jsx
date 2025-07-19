import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { examAttemptAPI } from '../../services/api';

const Results = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await examAttemptAPI.getStudentAttempts();
        setAttempts(data);
      } catch (err) {
        setError('Error loading results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <div className="p-6">Loading results...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Results</h1>
      {attempts.length === 0 ? (
        <div>No results found.</div>
      ) : (
        <div className="space-y-6">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{attempt.exam?.title || 'Exam'}</h2>
                  <p className="text-gray-600">Status: {attempt.status}</p>
                  <p className="text-gray-500 text-sm">Score: {attempt.score != null ? attempt.score : 'N/A'} / {attempt.maxScore != null ? attempt.maxScore : 'N/A'}</p>
                  <p className="text-gray-500 text-xs">Started: {attempt.startedAt?.slice(0, 16).replace('T', ' ')}</p>
                  {attempt.submittedAt && <p className="text-gray-500 text-xs">Submitted: {attempt.submittedAt?.slice(0, 16).replace('T', ' ')}</p>}
                  {attempt.gradedAt && <p className="text-gray-500 text-xs">Graded: {attempt.gradedAt?.slice(0, 16).replace('T', ' ')}</p>}
                </div>
                {attempt.status === 'GRADED' && attempt.feedback && (
                  <div className="text-blue-600 font-medium">Feedback: {attempt.feedback}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results; 