import {
  DefaultTheme, // eslint-disable-line import/named
  FlattenInterpolation, // eslint-disable-line import/named
  ThemedStyledProps, // eslint-disable-line import/named
  ViewportBreakpoint, // eslint-disable-line import/named
  css,
} from 'styled-components'

type Styles = FlattenInterpolation<ThemedStyledProps<{}, DefaultTheme>>

type ViewportBreakpointLower = Exclude<ViewportBreakpoint, 'extraLarge'>

type ViewportBreakpointUpper = Exclude<ViewportBreakpoint, 'small'>

const viewportBreakpointScale: Record<
  ViewportBreakpointLower,
  ViewportBreakpointUpper
> = { large: 'extraLarge', medium: 'large', small: 'medium' }

const from = (breakpoint: ViewportBreakpoint) => (styles: Styles) => css`
  @media screen and (min-width: ${({ theme }) => theme[breakpoint]}px) {
    ${styles};
  }
`

const only = (breakpoint: ViewportBreakpointLower) => (styles: Styles) => css`
  @media screen and (min-width: ${({ theme }) =>
      theme[breakpoint]}px) and (max-width: ${({ theme }) =>
      theme[viewportBreakpointScale[breakpoint]] - 1}px) {
    ${styles};
  }
`

const until = (breakpoint: ViewportBreakpoint) => (styles: Styles) => css`
  @media screen and (max-width: ${({ theme }) => theme[breakpoint] - 1}px) {
    ${styles};
  }
`

export const overflowTouch = css`
  -webkit-overflow-scrolling: touch;
`

export const untilSmall = until('small')

export const small = (styles: Styles) => css`
  @media screen and (min-width: ${({ theme }) => theme.small}px), print {
    ${styles};
  }
`

export const smallOnly = only('small')

export const untilMedium = until('medium')

export const medium = from('medium')

export const mediumOnly = only('medium')

export const untilLarge = until('large')

export const large = from('large')

export const largeOnly = only('large')

export const untilExtraLarge = until('extraLarge')

export const extraLarge = from('extraLarge')

export const isHiddenUntilSmall = css`
  ${untilSmall(css`
    display: none !important;
  `)};
`

export const isHiddenSmall = css`
  ${small(css`
    display: none !important;
  `)};
`

export const container = (isFluid = false) => {
  const fluid = css`
    padding-left: ${({ theme }) => theme.gap}px;
    padding-right: ${({ theme }) => theme.gap}px;
  `

  const centered = (breakpoint: ViewportBreakpoint) => css`
    max-width: ${({ theme }) => theme[breakpoint] - 2 * theme.gap}px;
  `

  return css`
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: ${isFluid ? '100%' : 'auto'};

    ${isFluid
      ? fluid
      : css`
          ${extraLarge(centered('extraLarge'))};

          ${untilExtraLarge(centered('extraLarge'))};

          ${large(centered('large'))};

          ${untilLarge(centered('large'))};

          ${medium(centered('medium'))};
        `};
  `
}
