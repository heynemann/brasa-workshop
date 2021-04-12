const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Novamente mesma função para construir nosso schema
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`)

// Se o tipo Message tivesse qualquer campo complexo (métodos),
// colocaríamos nessa classe.
class Message {
  constructor(id, { content, author }) {
    this.id = id
    this.content = content
    this.author = author
  }
}

// Mapeia username ao conteúdo
var fakeDatabase = {}

var root = {
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`Não existem mensagens com id ${id}`)
    }
    return new Message(id, fakeDatabase[id])
  },
  createMessage: ({ input }) => {
    // Cria uma id aleatório para o nosso "banco de dados".
    const id = require('crypto').randomBytes(10).toString('hex')

    fakeDatabase[id] = input
    return new Message(id, input)
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`Não existem mensagens com id ${id} para alterar`)
    }
    // Isso substitui o dado anterior completamente.
    fakeDatabase[id] = input
    return new Message(id, input)
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

qweqweqweqwe

console.log('API GraphQL está rodando em http://localhost:4000/graphql...')
console.log()
console.log(
  'Para acessar o GraphiQL basta colocar http://localhost:4000/graphql no seu browser.'
)
