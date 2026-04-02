import { renderUI } from '@helpers/nuxt-ui-render';
import { fireEvent, screen } from '@testing-library/vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { getRouter } from 'vue-router-mock';
import UnknownPage from '@/pages/[...path].vue';

describe('404 Page', () => {
  beforeEach(() => {
    renderUI(UnknownPage);
  });

  it('should render the page', async () => {
    expect(await screen.findByText('404')).toBeInTheDocument();
    expect(await screen.findByText('Page not found')).toBeInTheDocument();
  });

  it('should be possible to return back', async () => {
    // Arrange
    const goBack = screen.getByTestId('not-found:go-back');

    // Act
    await fireEvent.click(goBack);

    // Assert
    const router = getRouter();
    expect(router.push).toHaveBeenCalledWith({ name: 'dashboard' });
  });
});
