import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
// import {screen} from '@testing-library/react';

import Emoji from '../components/Emoji';

/**
 */
test('Smiley', async () => {
  render(<Emoji />);
  // fireEvent.click(screen.getByText('Get Dummy'));
  // await screen.findByText('Hello CSE186');
});
