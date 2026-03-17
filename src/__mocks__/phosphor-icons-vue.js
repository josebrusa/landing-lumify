const stub = { name: 'PhIconStub', template: '<span />' }

module.exports = new Proxy(
  {},
  {
    get(_, prop) {
      return stub
    },
  }
)
