import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test("renders Hello from dashboard link", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/hello from dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
