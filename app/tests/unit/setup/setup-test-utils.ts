import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Not implemented in JSDOM
Element.prototype.scrollIntoView = vi.fn();
