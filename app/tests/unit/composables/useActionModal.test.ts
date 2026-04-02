import type { Mock } from 'vitest';
import { useOverlay } from '@nuxt/ui/runtime/composables/useOverlay.js';
import { describe, expect, it, vi } from 'vitest';
import { useActionModal } from '@/composables';

vi.mock('@nuxt/ui/runtime/composables/useOverlay.js', () => {
  return {
    useOverlay: vi.fn(),
  };
});
vi.mock('@/utils', () => {
  return {
    $fetch: vi.fn(),
  };
});

describe('useActionModal', () => {
  it('should be possible to open the modal', () => {
    // Arrange
    const openSpy = vi.fn(() => 'test');
    (useOverlay as unknown as Mock).mockImplementationOnce(() => {
      return {
        create: () => {
          return {
            open: openSpy,
          };
        },
      };
    });
    const { open } = useActionModal({
      title: '',
      actions: [],
    });

    // Act
    open();

    // Assert
    expect(openSpy).toHaveBeenCalledWith({
      title: '',
      actions: [],
    });
  });

  it('should be possible to close the modal', () => {
    const closeSpy = vi.fn(() => 'test');
    (useOverlay as unknown as Mock).mockImplementationOnce(() => {
      return {
        create: () => {
          return {
            close: closeSpy,
          };
        },
      };
    });
    const { close } = useActionModal({
      title: '',
      actions: [],
    });

    // Act
    close();

    // Assert
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should be possible to get the action result', async () => {
    const openSpy = vi.fn(() => ({ result: 'test' }));
    (useOverlay as unknown as Mock).mockImplementationOnce(() => {
      return {
        create: () => {
          return {
            open: openSpy,
          };
        },
      };
    });
    const { open, actionTaken } = useActionModal({
      title: '',
      actions: [
        {
          action: 'test',
          label: 'Test',
        },
      ],
    });

    // Act
    open();
    const res = await actionTaken.value;

    // Assert
    expect(res).toBe('test');
  });
});
