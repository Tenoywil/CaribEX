import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for viem and wagmi
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
