const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Novamente mesma função para construir nosso schema
const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
		rollDice(numDice: Int!, numSides: Int): [Int]
  }
`)

// Novamente precisamos prover o que deve ser executado em cada resolver
const root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Vai com calma!' : 'Agora vai!'
  },
  random: () => {
    return Math.random()
  },
  rollDice: (args) => {
    const output = []
    for (let i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)))
    }
    return output
  },
}

// Agora configuramos o express para usar o nosso schema GraphQL
const app = express()
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
