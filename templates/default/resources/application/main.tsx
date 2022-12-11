import { createInertiaApp, PreactComponent } from '@jrson83/inertia-preact'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { render } from 'preact'

import './app.css'

createInertiaApp({
  progress: false,
  title: (title) => `${title} - Demo`,
  resolve: (name) =>
    resolvePageComponent(
      `../views/pages/${name}.tsx`,
      import.meta.glob<PreactComponent>('../views/pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    render(<App {...props} />, el)
  },
})
