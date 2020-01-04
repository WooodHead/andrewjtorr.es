import React from 'react'

import { renderWithContext } from 'utils/spec'
import { Heading } from '.'

test('should render correctly', () => {
  const { firstChild } = renderWithContext(<Heading>Heading</Heading>).container

  expect(firstChild).toMatchInlineSnapshot(`
    .c0 {
      box-sizing: border-box;
      margin: 0;
      min-width: 0;
      color: #363636;
      font-size: 2.5rem;
      font-weight: 600;
      line-height: 1.125;
      word-break: break-word;
    }

    <h2
      class="b75vhe-0 c0"
      color="#363636"
      font-size="2.5rem"
      font-weight="600"
    >
      Heading
    </h2>
  `)
})