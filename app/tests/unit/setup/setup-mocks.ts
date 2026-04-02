import { vi } from 'vitest';

// Mock Pointer Events for Triggering user events with testing-library.
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

vi.mock('@nuxt/ui/runtime/composables/useToast.js', async (original) => {
  const { toastMock } = await import('@mocks/toast.mock');

  return {
    ...(await original()),
    useToast: vi.fn(() => ({
      add: toastMock,
    })),
  };
});
