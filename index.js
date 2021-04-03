var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var { buildSchema } = require('graphql')

// Novamente mesma função para construir nosso schema
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`)

// Novamente precisamos prover o que deve ser executado em cada resolver
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Vai com calma!' : 'Agora vai!'
  },
  random: () => {
    return Math.random()
  },
  rollThreeDice: () => {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6))
  },
}

// Agora configuramos o express para usar o nosso schema GraphQL
var app = express()
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(4000)

console.log('API GraphQL está rodando em http://localhost:4000/graphql...')
console.log()
console.log(
  'Para acessar o GraphiQL basta colocar http://localhost:4000/graphql no seu browser.'
)
