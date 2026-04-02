import type { RouteLocationNormalized } from 'vue-router';
import { useTitleMock } from '@mocks/useTitle.mock';
import { describe, expect, it, vi } from 'vitest';
import { titleGuard } from '@/guards';

vi.mock('@vueuse/core', async (actual) => {
  const { useTitleMock } = await import('@mocks/useTitle.mock');
  return {
    ...(await actual()),
    useTitle: useTitleMock,
  };
});

describe('title Guard', () => {
  it('should update the title of the page with the route meta data', () => {
    // Arrange
    const to = { meta: { title: 'app.title' } } as unknown as RouteLocationNormalized;

    // Act
    titleGuard(to);

    // Assert
    expect(useTitleMock).toHaveBeenCalledWith('<project-name>', {
      titleTemplate: '%s | <project-name>',
    });
  });

  it('should pass the route to the title params', () => {
    // Arrange
    const to = {
      params: { id: 1 },
      meta: {
        title: 'app.pages.users.create.toasts.onSuccess.description',
        titleParams: {
          name: (route: RouteLocationNormalized) => route.params.id,
        },
      },
    } as unknown as RouteLocationNormalized;

    // Act
    titleGuard(to);

    // Assert
    expect(useTitleMock).toHaveBeenCalledWith('User \'1\' has been created.', {
      titleTemplate: '%s | <project-name>',
    });
  });
});
