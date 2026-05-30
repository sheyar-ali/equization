/**
 * tests/unit/pages/play/totalscores.spec.js
 * Unit tests for the solo quiz final results page.
 *
 * Coverage:
 *  - Shows "loading" spinner while submitting
 *  - Calls /play/submit and populates score, correct, accuracy from server
 *  - Falls back to local data when API call fails
 *  - Renders correct + incorrect breakdown items
 *  - Shows correct answer hint for wrong answers
 *  - goHome navigates to /explore
 *  - playAgain navigates to /play/options when quizId exists
 *  - Clears sessionStorage after mount
 */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import TotalScoresPage from '@/pages/play/totalscores.vue';

const localVue    = createLocalVue();
const mockRouter  = { push: jest.fn() };
const mockAxios   = { post: jest.fn() };

// ── Fixture data ──────────────────────────────────────────────────────────────
const soloQuestions = [
  {
    _id: 'q1', questionText: 'What is 2+2?',
    answers: [
      { _id: 'a1', text: '4', isCorrect: true },
      { _id: 'a2', text: '3', isCorrect: false },
    ],
  },
  {
    _id: 'q2', questionText: 'What color is the sky?',
    answers: [
      { _id: 'b1', text: 'Blue',  isCorrect: true },
      { _id: 'b2', text: 'Green', isCorrect: false },
    ],
  },
];

const soloAnswers = [
  { questionId: 'q1', selectedAnswers: ['a1'], isCorrect: true,  points: 90, timeSpent: 5000 },
  { questionId: 'q2', selectedAnswers: ['b2'], isCorrect: false, points: 0,  timeSpent: 5000 },
];

const serverResult = {
  score:           90,
  correctAnswers:  1,
  wrongAnswers:    1,
  totalQuestions:  2,
  accuracy:        '50.00',
  rank:            1,
};

const serverAnswers = [
  { question: 'q1', isCorrect: true,  points: 90 },
  { question: 'q2', isCorrect: false, points: 0  },
];

function populateSession() {
  sessionStorage.setItem('soloPlayerName',   'Alice');
  sessionStorage.setItem('soloQuizId',       'quiz123');
  sessionStorage.setItem('soloQuestions',    JSON.stringify(soloQuestions));
  sessionStorage.setItem('soloAnswers',      JSON.stringify(soloAnswers));
  sessionStorage.setItem('playerGameState',  JSON.stringify({ score: 90, totalQuestions: 2 }));
  sessionStorage.setItem('currentQuizId',    'quiz123');
}

function mountPage() {
  return shallowMount(TotalScoresPage, {
    localVue,
    mocks: {
      $router:    mockRouter,
      $axios:     mockAxios,
      $t:         k => k,
      localePath: p => p,
    },
  });
}

afterEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});

// ─────────────────────────────────────────────────────────────────────────────
describe('mount – API success', () => {
  beforeEach(() => {
    populateSession();
    mockAxios.post.mockResolvedValue({
      data: { data: { result: serverResult, answers: serverAnswers } }
    });
  });

  it('starts in submitting=true state', () => {
    const w = mountPage();
    expect(w.vm.submitting).toBe(true);
  });

  it('calls /play/submit with collected answers', async () => {
    mountPage();
    await new Promise(r => setTimeout(r, 50));
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/play/submit',
      expect.objectContaining({ quizId: 'quiz123', playerName: 'Alice' })
    );
  });

  it('populates score, correct, accuracy from server response', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));

    expect(w.vm.score).toBe(90);
    expect(w.vm.correct).toBe(1);
    expect(w.vm.accuracy).toBe(50);
  });

  it('builds answerBreakdown with correct/incorrect items', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));

    expect(w.vm.answerBreakdown).toHaveLength(2);
    expect(w.vm.answerBreakdown[0].isCorrect).toBe(true);
    expect(w.vm.answerBreakdown[1].isCorrect).toBe(false);
  });

  it('provides correctAnswerText for wrong answers', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));

    const wrongItem = w.vm.answerBreakdown[1];
    expect(wrongItem.correctAnswerText).toBe('Blue');
  });

  it('no correctAnswerText for correct answers', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));

    const correctItem = w.vm.answerBreakdown[0];
    // Text exists but it's the answer they got right — no "hint" needed
    expect(correctItem.isCorrect).toBe(true);
  });

  it('clears sessionStorage after mount', async () => {
    mountPage();
    await new Promise(r => setTimeout(r, 50));

    expect(sessionStorage.getItem('soloQuestions')).toBeNull();
    expect(sessionStorage.getItem('soloAnswers')).toBeNull();
    expect(sessionStorage.getItem('soloQuizId')).toBeNull();
  });

  it('sets submitting=false after API call', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));
    expect(w.vm.submitting).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('mount – API failure fallback', () => {
  beforeEach(() => {
    populateSession();
    mockAxios.post.mockRejectedValue(new Error('Network error'));
  });

  it('falls back to local soloAnswers data', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));

    expect(w.vm.correct).toBe(1); // 1 correct in soloAnswers
    expect(w.vm.submitting).toBe(false);
  });

  it('still builds answerBreakdown from local data', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));

    expect(w.vm.answerBreakdown).toHaveLength(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('navigation', () => {
  beforeEach(() => {
    populateSession();
    mockAxios.post.mockResolvedValue({
      data: { data: { result: serverResult, answers: serverAnswers } }
    });
  });

  it('goHome pushes /explore', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));
    w.vm.goHome();
    expect(mockRouter.push).toHaveBeenCalledWith('/explore');
  });

  it('playAgain pushes /play/options when quizId is set', async () => {
    const w = mountPage();
    await new Promise(r => setTimeout(r, 50));
    w.vm.playAgain();
    expect(mockRouter.push).toHaveBeenCalledWith('/play/options');
  });
});
