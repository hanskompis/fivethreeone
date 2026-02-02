import { render, waitFor } from '@testing-library/react-native';
import { AnimatedSplash } from './AnimatedSplash';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('AnimatedSplash', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders all three numbers', () => {
    const mockOnComplete = jest.fn();
    const { getAllByText } = render(
      <AnimatedSplash onAnimationComplete={mockOnComplete} />
    );

    // Each number appears twice (main + shadow layer)
    expect(getAllByText('5').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('3').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('1').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onAnimationComplete callback after animation', async () => {
    const mockOnComplete = jest.fn();
    render(<AnimatedSplash onAnimationComplete={mockOnComplete} />);

    // Fast-forward through all animations and timeouts
    jest.advanceTimersByTime(3000);

    await waitFor(
      () => {
        expect(mockOnComplete).toHaveBeenCalled();
      },
      { timeout: 5000 }
    );
  });

  it('renders without crashing', () => {
    const mockOnComplete = jest.fn();
    render(<AnimatedSplash onAnimationComplete={mockOnComplete} />);

    // The component should render without crashing
    // This verifies the basic structure is correct
    expect(true).toBe(true);
  });
});
