import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SendConfirmation } from '@/components/wallet/SendConfirmation';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useSendTransaction: jest.fn(() => ({
    sendTransaction: jest.fn(),
    data: null,
    error: null,
  })),
  useWaitForTransactionReceipt: jest.fn(() => ({
    isSuccess: false,
    isLoading: false,
  })),
  useAccount: jest.fn(() => ({
    chainId: 1,
  })),
}));

// Mock viem
jest.mock('viem', () => ({
  parseEther: jest.fn((value) => value),
}));

const renderComponent = (component: React.ReactElement) => {
  return render(component);
};

describe('SendConfirmation Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    to: '0x1234567890123456789012345678901234567890',
    amount: '0.01',
    note: 'Test payment',
    onSuccess: jest.fn(),
  };

  it('renders when isOpen is true', () => {
    renderComponent(<SendConfirmation {...defaultProps} />);
    expect(screen.getByText('Confirm Transaction')).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    renderComponent(<SendConfirmation {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Confirm Transaction')).toBeNull();
  });

  it('displays transaction details correctly', () => {
    renderComponent(<SendConfirmation {...defaultProps} />);
    expect(screen.getByText(/0x12345678/)).toBeDefined(); // First part of address
    expect(screen.getByText(/0.01.*ETH/)).toBeDefined();
    expect(screen.getByText('Test payment')).toBeDefined();
  });

  it('has Sign & Send button', () => {
    renderComponent(<SendConfirmation {...defaultProps} />);
    expect(screen.getByText('Sign & Send')).toBeDefined();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = jest.fn();
    renderComponent(<SendConfirmation {...defaultProps} onClose={onClose} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('displays security notice', () => {
    renderComponent(<SendConfirmation {...defaultProps} />);
    expect(screen.getByText(/Your transaction will be verified via backend RPC/)).toBeDefined();
  });
});
