import { createInertiaApp } from '@jrson83/inertia-preact'
import createServer from '@jrson83/inertia-preact/server'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import renderToString from 'preact-render-to-string'

createServer((page) =>
  createInertiaApp({
    page,
    title: (title) => `${title} - Demo`,
    render: renderToString,
    resolve: (name) =>
      resolvePageComponent(
        `../views/pages/${name}.jsx`,
        import.meta.glob('../views/pages/**/*.jsx'),
      ),
    setup: ({ App, props }) => <App {...props} />,
  }),
)
