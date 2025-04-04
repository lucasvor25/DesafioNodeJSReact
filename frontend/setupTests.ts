import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));
