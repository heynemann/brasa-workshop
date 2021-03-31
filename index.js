var express = require('express') // Web Framework
var { graphqlHTTP } = require('express-graphql') // Ponte entre GraphQL e Express
var { buildSchema } = require('graphql') // Mesma função que usamos no passo 1

// Novamente mesma função para construir nosso schema
var schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// Novamente precisamos prover o que deve ser executado em cada resolver
var root = {
  hello: () => {
    return 'Hello world!'
  },
}

// Agora configuramos o express para usar o nosso schema GraphQL
var app = express()
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // GraphiQL é uma interface que permite explorar nosso grafo
  })
)
app.listen(4000)

console.log('API GraphQL está rodando em http://localhost:4000/graphql...')
console.log()
console.log(
  'Para acessar o GraphiQL basta colocar http://localhost:4000/graphql no seu browser.'
)
