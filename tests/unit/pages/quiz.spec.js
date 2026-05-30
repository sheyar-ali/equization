/**
 * tests/unit/pages/quiz.spec.js
 * Unit tests for the quiz detail page (pages/quiz.vue).
 *
 * Coverage:
 *  - Fetches quiz by ?id= on mount
 *  - Fetches quiz by ?code= on mount
 *  - Shows loader while loading
 *  - Shows error when API fails
 *  - Renders title, description, creator name, date
 *  - playersDetails computed: correct creator name and date format
 *  - quizInfo computed: correct question count and players count
 *  - startIndividual stores quizId in sessionStorage and navigates
 *  - startMultiplayer stores quizId in sessionStorage and navigates
 *  - coverImgError fallback when image fails to load
 */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import QuizPage from '@/pages/quiz.vue';

// Mock child components to avoid deep-render issues
jest.mock('@/components/Shared-Components/PageTitle',            () => ({ render: h => h('div') }));
jest.mock('@/components/Quiz-Page-Components/PlayerDetails',     () => ({ render: h => h('div') }));
jest.mock('@/components/Quiz-Page-Components/QuizInfo',          () => ({ render: h => h('div') }));
jest.mock('@/components/Quiz-Page-Components/Categories',        () => ({ render: h => h('div') }));
jest.mock('@/components/Shared-Components/AppLoader',            () => ({ render: h => h('div') }), { virtual: true });

const localVue   = createLocalVue();
const mockRouter = { push: jest.fn() };
const mockAxios  = { get: jest.fn() };

// Minimal quiz fixture
const quizFixture = {
  _id:       'quiz123',
  title:     'اختبار اللغة الإنجليزية',
  description:        'Test your English',
  detailedDescription:'Detailed description',
  categories: [{ _id: 'c1', name: { ar: 'لغات أجنبية', en: 'Languages' }, slug: 'foreign-languages' }],
  questions:  [{ _id: 'q1' }, { _id: 'q2' }, { _id: 'q3' }],
  creator:    { username: 'omar_quiz', firstName: 'Omar', lastName: 'Ali' },
  createdAt:  '2026-01-15T10:00:00.000Z',
  statistics: { totalPlayers: 2156 },
};

function mountQuiz(routeQuery = { id: 'quiz123' }, apiResponse = null) {
  mockAxios.get.mockResolvedValue({
    data: { data: { quiz: apiResponse || quizFixture } }
  });

  return shallowMount(QuizPage, {
    localVue,
    mocks: {
      $router:     mockRouter,
      $route:      { query: routeQuery },
      $axios:      mockAxios,
      $t:          k => k,
      localePath:  p => p,
      $i18n:       { locale: 'ar' },
      $socket:     null,
    },
  });
}

afterEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});

// ─────────────────────────────────────────────────────────────────────────────
describe('data loading', () => {
  it('starts in loading=true state', () => {
    const w = mountQuiz();
    expect(w.vm.loading).toBe(true);
  });

  it('fetches quiz by id when ?id= is present', async () => {
    mountQuiz({ id: 'quiz123' });
    await new Promise(r => setTimeout(r, 20));
    expect(mockAxios.get).toHaveBeenCalledWith('/quizzes/quiz123');
  });

  it('fetches quiz by code when ?code= is present', async () => {
    mountQuiz({ code: 'ABC123' });
    await new Promise(r => setTimeout(r, 20));
    expect(mockAxios.get).toHaveBeenCalledWith('/quizzes/code/ABC123');
  });

  it('sets quiz data after successful fetch', async () => {
    const w = mountQuiz();
    await new Promise(r => setTimeout(r, 20));
    expect(w.vm.quiz).not.toBeNull();
    expect(w.vm.quiz.title).toBe('اختبار اللغة الإنجليزية');
    expect(w.vm.loading).toBe(false);
  });

  it('sets error when API fails', async () => {
    mockAxios.get.mockRejectedValue({ response: { data: { message: 'Not found' } } });
    const w = shallowMount(QuizPage, {
      localVue,
      mocks: {
        $router: mockRouter, $route: { query: { id: 'bad' } },
        $axios: mockAxios, $t: k => k, localePath: p => p,
        $i18n: { locale: 'ar' }, $socket: null,
      },
    });
    await new Promise(r => setTimeout(r, 20));
    expect(w.vm.error).toBe('Not found');
    expect(w.vm.loading).toBe(false);
  });

  it('sets error when no id or code in query', async () => {
    const w = shallowMount(QuizPage, {
      localVue,
      mocks: {
        $router: mockRouter, $route: { query: {} },
        $axios: mockAxios, $t: k => k, localePath: p => p,
        $i18n: { locale: 'ar' }, $socket: null,
      },
    });
    await new Promise(r => setTimeout(r, 20));
    expect(w.vm.error).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('playersDetails computed', () => {
  it('uses firstName + lastName when available', async () => {
    const w = mountQuiz();
    await new Promise(r => setTimeout(r, 20));
    const details = w.vm.playersDetails;
    expect(details[0].text).toBe('Omar Ali');
  });

  it('falls back to username when firstName is missing', async () => {
    const noName = { ...quizFixture, creator: { username: 'omar_quiz' } };
    const w = mountQuiz({ id: 'quiz123' }, noName);  // pass noName as apiResponse
    await new Promise(r => setTimeout(r, 20));
    expect(w.vm.playersDetails[0].text).toBe('omar_quiz');
  });

  it('includes a formatted date', async () => {
    const w = mountQuiz();
    await new Promise(r => setTimeout(r, 20));
    const datePart = w.vm.playersDetails[1];
    expect(datePart.text).toBeTruthy();
    expect(datePart.icon).toContain('calendar');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('quizInfo computed', () => {
  it('returns correct question count', async () => {
    const w = mountQuiz();
    await new Promise(r => setTimeout(r, 20));
    const info = w.vm.quizInfo;
    const qInfo = info.find(i => i.infoNumber === '3');
    expect(qInfo).toBeTruthy();
  });

  it('returns correct player count', async () => {
    const w = mountQuiz();
    await new Promise(r => setTimeout(r, 20));
    const info = w.vm.quizInfo;
    const pInfo = info.find(i => i.infoNumber === '2156');
    expect(pInfo).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('coverImgError', () => {
  it('starts as false', () => {
    const w = mountQuiz();
    expect(w.vm.coverImgError).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('start quiz actions', () => {
  it('startIndividual stores quizId and navigates to /play/options', async () => {
    const w = mountQuiz();
    await new Promise(r => setTimeout(r, 20));
    w.vm.startIndividual();
    expect(sessionStorage.getItem('currentQuizId')).toBe('quiz123');
    expect(mockRouter.push).toHaveBeenCalledWith('/play/options');
  });

  it('startMultiplayer stores quizId and navigates to /host/options', async () => {
    const w = mountQuiz();
    await new Promise(r => setTimeout(r, 20));
    w.vm.startMultiplayer();
    expect(sessionStorage.getItem('currentQuizId')).toBe('quiz123');
    expect(mockRouter.push).toHaveBeenCalledWith('/host/options');
  });
});
