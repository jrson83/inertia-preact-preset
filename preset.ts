interface Options {
  ssr: boolean
  typescript: boolean
}

export default definePreset<Options>({
  name: 'inertia-preact-preset',
  options: {
    ssr: true,
    typescript: true,
  },
  handler: async ({ options }) => {
    await installInertia(options)
  },
})

async function installInertia({ ssr, typescript }: Options) {
  await installPackages({
    title: 'install PHP dependencies',
    for: 'php',
    packages: ['inertiajs/inertia-laravel'],
  })

  await group({
    title: 'install Inertia scaffolding',
    handler: async () => {
      await deletePaths({
        title: 'remove some default files & folders',
        paths: ['resources', 'webpack.mix.js', 'vite.config.js'],
      })

      await extractTemplates({
        title: 'extract templates',
        from: typescript ? 'default' : 'jsx',
      })

      await executeCommand({
        title: 'publish Inertia configuration',
        command: 'php',
        arguments: [
          'artisan',
          'vendor:publish',
          '--provider=Inertia\\ServiceProvider',
        ],
      })

      await executeCommand({
        title: 'publish Inertia middleware',
        command: 'php',
        arguments: ['artisan', 'inertia:middleware'],
      })

      await editFiles({
        title: 'register Inertia middleware',
        files: 'app/Http/Kernel.php',
        operations: [
          {
            type: 'add-line',
            position: 'after',
            match: /SubstituteBindings::class,/,
            lines: '\\App\\Http\\Middleware\\HandleInertiaRequests::class,',
          },
        ],
      })

      await editFiles({
        title: 'update Inertia middleware',
        files: 'app/Http/Middleware/HandleInertiaRequests.php',
        operations: [
          {
            type: 'remove-line',
            match: /array_merge\(parent::share/,
            count: 1,
            start: 1,
          },
          {
            type: 'add-line',
            position: 'after',
            match: /array_merge\(parent::share/,
            indent: '            ',
            lines: [
              "'versions' => [",
              "    'php' => PHP_VERSION,",
              "    'laravel' => \\Illuminate\\Foundation\\Application::VERSION",
              '],',
            ],
          },
        ],
      })

      await editFiles({
        title: 'register Inertia pages for testing',
        files: 'config/inertia.php',
        operations: [
          {
            ...(ssr && {
              type: 'update-content',
              update: (content) =>
                content.replace(`'enabled' => false`, `'enabled' => true`),
            }),
          },
          {
            type: 'update-content',
            update: (content) => content.replace('js/Pages', 'views/pages'),
          },
          {
            type: 'update-content',
            update: (content) =>
              content // Fixes weird line returns
                .replace(/\n\n/g, '\n')
                .replace(/\/\*/g, '\n    /*'),
          },
        ],
      })

      await editFiles({
        title: 'udpate route file',
        files: 'routes/web.php',
        operations: [
          {
            type: 'add-line',
            position: 'before',
            match: /use Illuminate\\Support\\Facades\\Route;/,
            lines: [`use Inertia\\Inertia;`],
          },
          {
            type: 'update-content',
            update: (r) =>
              r.replace("view('welcome')", "Inertia::render('home')"),
          },
          {
            type: 'add-line',
            position: 'append',
            lines: [
              "Route::get('/example', function () {",
              "    return Inertia::render('example');",
              '});',
            ],
          },
        ],
      })
    },
  })

  await group({
    title: 'install Node dependencies',
    handler: async () => {
      await editFiles({
        title: 'update package.json',
        files: 'package.json',
        operations: [
          { type: 'edit-json', delete: ['scripts', 'devDependencies'] },
          {
            type: 'edit-json',
            merge: {
              scripts: {
                dev: 'vite',
                build: 'vite build',
                ...(ssr && { 'build:ssr': 'vite build --ssr' }),
                ...(ssr && { 'build:prod': 'vite build && vite build --ssr' }),
                ...(ssr && {
                  preview: 'npm run build:prod && node bootstrap/ssr/ssr.js',
                }),
                clean: 'rm -rf public/build bootstrap/ssr',
              },
            },
          },
        ],
      })

      await installPackages({
        title: 'install devDependencies',
        for: 'node',
        packages: [
          '@jrson83/inertia-preact',
          '@preact/preset-vite',
          typescript && '@types/node',
          'laravel-vite-plugin',
          'postcss',
          'preact',
          ssr && 'preact-render-to-string',
          typescript && 'typescript',
          'vite@3.2.3',
        ],
        dev: true,
      })

      await installPackages({
        title: 'install dependencies',
        for: 'node',
        install: ['axios'],
      })
    },
  })
}
