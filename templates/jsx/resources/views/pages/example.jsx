import { Head } from '@jrson83/inertia-preact'
import { Fragment } from 'preact'

import Counter from '@/views/components/counter'
import Layout from '@/views/layouts/default'

const Example = () => {
  return (
    <Fragment>
      <Head title="Example" />
      <h1>Counter</h1>
      <p>
        This is a simple, hydrated <code>Counter</code> component.
      </p>
      <Counter />
    </Fragment>
  )
}

Example.layout = (page) => <Layout children={page} title="Example" />

export default Example
