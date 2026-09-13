import React from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, CheckCircle2, Clock3, GraduationCap, ListChecks, RotateCcw } from 'lucide-react';
import './styles.css';

const subjects = [
  { name: 'Toán', tests: 24, minutes: 90, color: '#2563eb' },
  { name: 'Ngữ văn', tests: 16, minutes: 120, color: '#9333ea' },
  { name: 'Tiếng Anh', tests: 30, minutes: 60, color: '#0891b2' },
  { name: 'Vật lý', tests: 18, minutes: 50, color: '#ea580c' },
  { name: 'Hóa học', tests: 18, minutes: 50, color: '#16a34a' },
  { name: 'Sinh học', tests: 18, minutes: 50, color: '#65a30d' },
  { name: 'Lịch sử', tests: 14, minutes: 50, color: '#b45309' },
  { name: 'Địa lý', tests: 14, minutes: 50, color: '#0f766e' },
  { name: 'GDKT & PL', tests: 12, minutes: 50, color: '#be123c' },
];

const questions = [
  {
    id: 1,
    subject: 'Toán',
    text: 'Cho hàm số f(x) = 2x² - 3x + 1. Giá trị của f(-2) là bao nhiêu?',
    choices: ['3', '9', '15', '17'],
    answer: 15,
    explanation: 'Thay x = -2: 2.4 + 6 + 1 = 15.',
  },
  {
    id: 2,
    subject: 'Toán',
    text: 'Nếu x + y = 10 và x - y = 4, giá trị của xy là bao nhiêu?',
    choices: ['14', '21', '24', '28'],
    answer: 21,
    explanation: 'Cộng hai phương trình được 2x = 14 nên x = 7, y = 3, xy = 21.',
  },
  {
    id: 3,
    subject: 'Tiếng Anh',
    text: 'Choose the correct sentence.',
    choices: ['I am working on today.', 'I am working today.', 'I working today.', 'I am work today.'],
    answer: 'I am working today.',
    explanation: 'Today là trạng từ chỉ thời gian, không dùng on trước today.',
  },
  {
    id: 4,
    subject: 'Vật lý',
    text: 'Đơn vị đo cường độ dòng điện trong hệ SI là gì?',
    choices: ['Vôn', 'Ampe', 'Ôm', 'Jun'],
    answer: 'Ampe',
    explanation: 'Cường độ dòng điện có đơn vị là ampe, ký hiệu A.',
  },
  {
    id: 5,
    subject: 'Hóa học',
    text: 'Công thức hóa học của nước là gì?',
    choices: ['CO2', 'H2O', 'NaCl', 'O2'],
    answer: 'H2O',
    explanation: 'Nước gồm 2 nguyên tử hydrogen và 1 nguyên tử oxygen.',
  },
];

function App() {
  const [activeQuestion, setActiveQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0);
  const question = questions[activeQuestion];

  const resetTest = () => {
    setAnswers({});
    setSubmitted(false);
    setActiveQuestion(0);
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">MinPractice THPT</p>
          <h1>Hệ thống luyện đề thi tốt nghiệp THPT</h1>
          <p className="hero-copy">Chọn môn, làm bài theo thời gian, theo dõi tiến độ và xem lại đáp án sau khi nộp bài.</p>
        </div>
        <div className="hero-stats" aria-label="Tổng quan hệ thống">
          <span><GraduationCap size={18} /> 9 môn học</span>
          <span><BookOpen size={18} /> 164 đề mẫu</span>
          <span><Clock3 size={18} /> Luyện theo timer</span>
        </div>
      </section>

      <section className="subject-grid" aria-label="Danh sách môn thi">
        {subjects.map((subject) => (
          <article className="subject-card" key={subject.name} style={{ '--accent': subject.color }}>
            <div className="subject-icon">{subject.name.slice(0, 1)}</div>
            <h2>{subject.name}</h2>
            <p>{subject.tests} đề luyện tập</p>
            <span>{subject.minutes} phút / đề</span>
          </article>
        ))}
      </section>

      <section className="test-layout">
        <aside className="test-panel">
          <div className="panel-title">
            <ListChecks size={18} />
            <strong>Đề minh họa</strong>
          </div>
          <div className="progress-box">
            <span>Tiến độ</span>
            <strong>{answeredCount}/{questions.length}</strong>
          </div>
          <div className="question-nav">
            {questions.map((item, index) => (
              <button
                key={item.id}
                className={index === activeQuestion ? 'active' : answers[item.id] ? 'answered' : ''}
                onClick={() => setActiveQuestion(index)}
                type="button"
              >
                {item.id}
              </button>
            ))}
          </div>
          <button className="submit-button" onClick={() => setSubmitted(true)} type="button">Nộp bài</button>
        </aside>

        <article className="question-card">
          <div className="question-meta">
            <span>{question.subject}</span>
            <span>Câu {question.id}/{questions.length}</span>
          </div>
          <h2>{question.text}</h2>
          <div className="choice-list">
            {question.choices.map((choice) => {
              const isSelected = answers[question.id] === choice;
              const isCorrect = submitted && choice === question.answer;
              const isWrong = submitted && isSelected && choice !== question.answer;
              return (
                <button
                  key={choice}
                  className={isCorrect ? 'correct' : isWrong ? 'wrong' : isSelected ? 'selected' : ''}
                  onClick={() => !submitted && setAnswers({ ...answers, [question.id]: choice })}
                  type="button"
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="result-box">
              <CheckCircle2 size={20} />
              <div>
                <strong>Kết quả: {score}/{questions.length} câu đúng</strong>
                <p>{question.explanation}</p>
              </div>
            </div>
          )}

          <div className="question-actions">
            <button onClick={() => setActiveQuestion(Math.max(0, activeQuestion - 1))} type="button">Câu trước</button>
            <button onClick={() => setActiveQuestion(Math.min(questions.length - 1, activeQuestion + 1))} type="button">Câu sau</button>
            <button className="ghost" onClick={resetTest} type="button"><RotateCcw size={16} /> Làm lại</button>
          </div>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
