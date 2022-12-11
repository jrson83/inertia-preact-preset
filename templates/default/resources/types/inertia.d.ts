import type { ComponentChildren } from 'preact'
import type {
  Page as _Page,
  PageProps,
  Errors,
  ErrorBag,
} from '@inertiajs/core'

declare global {
  export { _Page as Page }

  export interface InteriaPage extends _Page<PageProps> {
    props: {
      errors: Errors & ErrorBag
      auth: {
        user: {
          name: string
        }
      }
      versions: {
        laravel: string
        php: string
      }
    }
  }

  export type WithChildren<T = {}> = T & { children?: ComponentChildren }

  export type LayoutProps = WithChildren<{
    title?: string
  }>
}
