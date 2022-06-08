import React from 'react'
import Cookies from 'js-cookie'
import styled, {
  ThemeProvider as StyledThemeProvider,
} from 'styled-components'
import { FaSun, FaMoon } from 'react-icons/fa'
import type { ReactNode } from 'react'

import { THEMES, DEFAULT_THEME, THEME_KEY } from '../constants'

type Props = {
  children: ReactNode;
};

type Theme = typeof DEFAULT_THEME;
type ThemeOptions = 'light' | 'dark';

const ThemeSwitcherStyles = styled.aside`
  --spacing: 1rem;
  position: fixed;
  bottom: var(--spacing);
  right: calc(var(--spacing) * 1.5);
`

export default function ThemeProvider({ children }: Props) {
  const savedThemeKey: string | undefined = Cookies.get(THEME_KEY)

  const initTheme = React.useMemo(() => {
    return savedThemeKey
      ? THEMES[savedThemeKey as ThemeOptions]
      : DEFAULT_THEME
  }, [savedThemeKey])

  const [theme, setTheme] = React.useState<Theme>(initTheme)

  const getTheme: () => ThemeOptions = React.useCallback(() => {
    if (theme.color.includes('dark')) {
      return 'light'
    }
    return 'dark'
  }, [theme])

  const changeTheme = React.useCallback(() => {
    const newThemeKey = getTheme() === 'light' ? 'dark' : 'light'
    setTheme(THEMES[newThemeKey])
    Cookies.set(THEME_KEY, newThemeKey)
  }, [getTheme])

  const icon = React.useMemo(() => {
    return getTheme() === 'light' ? <FaSun /> : <FaMoon />
  }, [getTheme])

  return (
    <StyledThemeProvider theme={theme}>
      {children}

      <ThemeSwitcherStyles>
        <div className="flex items-center">
          <div className="mr-2 text-umami-yellow">{icon}</div>
          <div
            role="checkbox"
            aria-checked={getTheme() === 'dark'}
            tabIndex={0}
            className={`p-1 border-gray-300 transition-all duration-500 hover:shadow cursor-pointer rounded-full flex w-12 ${
              getTheme() === 'light' ? 'bg-gray-400' : 'justify-end bg-blue-500'
            }`}
            onClick={() => changeTheme()}
          >
            <div className="h-4 w-4 rounded-full bg-white" />
          </div>
        </div>
      </ThemeSwitcherStyles>
    </StyledThemeProvider>
  )
}
