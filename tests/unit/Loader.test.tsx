import { render, screen } from '@testing-library/react';
import { Loader } from '@/components/ui/Loader';

describe('Loader Component', () => {
  it('renders loader with default medium size', () => {
    render(<Loader />);
    const loader = screen.getByRole('generic');
    expect(loader).toBeInTheDocument();
  });

  it('renders small loader when size prop is sm', () => {
    render(<Loader size="sm" />);
    const loader = screen.getByRole('generic');
    expect(loader.firstChild).toHaveClass('w-4 h-4');
  });

  it('renders large loader when size prop is lg', () => {
    render(<Loader size="lg" />);
    const loader = screen.getByRole('generic');
    expect(loader.firstChild).toHaveClass('w-12 h-12');
  });
});
