import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) =>
    api.post('/auth/signin', credentials).then(res => res.data),
  
  signup: (userData) =>
    api.post('/auth/signup', userData).then(res => res.data),
};

// User API
export const userAPI = {
  getAllUsers: () =>
    api.get('/admin/users').then(res => res.data),
  
  getUsersByRole: (role) =>
    api.get(`/admin/users/role/${role}`).then(res => res.data),
  
  getUserById: (id) =>
    api.get(`/admin/users/${id}`).then(res => res.data),
  
  createUser: (userData) =>
    api.post('/admin/users', userData).then(res => res.data),
  
  updateUser: (id, userData) =>
    api.put(`/admin/users/${id}`, userData).then(res => res.data),
  
  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`).then(res => res.data),
  
  getUserStats: () =>
    api.get('/admin/stats/users').then(res => res.data),
};

// Admin API
export const adminAPI = {
  getOverviewStats: () =>
    api.get('/admin/stats/overview').then(res => res.data),
  
  getActivity: () =>
    api.get('/admin/activity').then(res => res.data),
};

// Assignment API
// export const assignmentAPI = {
//   getStudentAssignments: () =>
//     api.get('/assignments/student/me').then(res => res.data),
  
//   getTeacherAssignments: () =>
//     api.get('/assignments/teacher').then(res => res.data),
  
//   createAssignment: (assignmentData) =>
//     api.post('/assignments', assignmentData).then(res => res.data),
  
//   updateAssignment: (id, assignmentData) =>
//     api.put(`/assignments/${id}`, assignmentData).then(res => res.data),
  
//   deleteAssignment: (id) =>
//     api.delete(`/assignments/${id}`).then(res => res.data),
  
//   submitAssignment: (id, submissionData) =>
//     api.post(`/assignments/${id}/submit`, submissionData).then(res => res.data),
// };

// Question API
export const questionAPI = {
  getQuestions: () =>
    api.get('/teacher/questions').then(res => res.data),
  
  createQuestion: (questionData) =>
    api.post('/teacher/questions', questionData).then(res => res.data),
  
  getQuestionById: (id) =>
    api.get(`/teacher/questions/${id}`).then(res => res.data),
  
  updateQuestion: (id, questionData) =>
    api.put(`/teacher/questions/${id}`, questionData).then(res => res.data),
  
  deleteQuestion: (id) =>
    api.delete(`/teacher/questions/${id}`).then(res => res.data),
  
  getSubjects: () =>
    api.get('/teacher/questions/subjects').then(res => res.data),
  
  getQuestionsBySubject: (subject) =>
    api.get(`/teacher/questions/subject/${subject}`).then(res => res.data),
};

// Exam API
export const examAPI = {
  getExams: () =>
    api.get('/teacher/exams').then(res => res.data),
  
  createExam: (examData) =>
    api.post('/teacher/exams', examData).then(res => res.data),
  
  getExamById: (id) =>
    api.get(`/teacher/exams/${id}`).then(res => res.data),
  
  updateExam: (id, examData) =>
    api.put(`/teacher/exams/${id}`, examData).then(res => res.data),
  
  deleteExam: (id) =>
    api.delete(`/teacher/exams/${id}`).then(res => res.data),
  
  getActiveExams: () =>
    api.get('/student/exams/active').then(res => res.data),
  
  getUpcomingExams: () =>
    api.get('/student/exams/upcoming').then(res => res.data),
  
  getExamForStudent: (id) =>
    api.get(`/student/exams/${id}`).then(res => res.data),
};

// Exam Attempt API
export const examAttemptAPI = {
  startExam: (examId) =>
    api.post(`/student/exams/${examId}/start`).then(res => res.data),
  
  updateAttempt: (attemptId, attemptData) =>
    api.put(`/student/attempts/${attemptId}`, attemptData).then(res => res.data),
  
  submitAttempt: (attemptId) =>
    api.post(`/student/attempts/${attemptId}/submit`).then(res => res.data),
  
  getStudentAttempts: () =>
    api.get('/student/attempts').then(res => res.data),
  
  getPendingGrading: () =>
    api.get('/teacher/attempts/pending').then(res => res.data),
  
  gradeAttempt: (attemptId, score, feedback) =>
    api.post(`/teacher/attempts/${attemptId}/grade`, { score, feedback }).then(res => res.data),
};

export default api;