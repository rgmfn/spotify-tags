import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Dummy from '../components/Dummy';

const URL = 'http://localhost:3010/v0/dummy';

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(ctx.json({message: 'Hello CSE186'}));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 */
test('Button Clickable', async () => {
  render(<Dummy />);
  fireEvent.click(screen.getByText('Get Dummy'));
  await screen.findByText('Hello CSE186');
});

/**
 */
test('Handles Server Error', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  render(<Dummy />);
  fireEvent.click(screen.getByText('Get Dummy'));
  await screen.findByText('ERROR: ', {exact: false});
});
