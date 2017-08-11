import Raven from 'raven-js'

if (process.env.NODE_ENV === 'production') {
  Raven.config(
    'https://6b8c830de7364b18aee7961f1d3a0dfa@sentry.io/202589',
  ).install()
}
