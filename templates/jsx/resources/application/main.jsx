import { createInertiaApp } from '@jrson83/inertia-preact'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { render } from 'preact'

import './app.css'

createInertiaApp({
  progress: false,
  title: (title) => `${title} - Demo`,
  resolve: (name) =>
    resolvePageComponent(
      `../views/pages/${name}.jsx`,
      import.meta.glob('../views/pages/**/*.jsx'),
    ),
  setup({ el, App, props }) {
    render(<App {...props} />, el)
  },
})
