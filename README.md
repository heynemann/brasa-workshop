# brasa-workshop

Workshop de Jamstack e GraphQL para Brasa

## Requerimento

É necessário que você tenha uma versão moderna de node.js instalado na sua máquina. Sugerimos usar a v14.16.0 que é uma versão com suporte de longo prazo.

Para ter certeza da versão do seu node.js, digite:

```
    node --version
```

Além disso vamos usar o gerenciador de pacotes yarn para Node. Para instalá-lo, digite no terminal (em qualquer pasta):

```
    npm install -g yarn
```

Digite então `yarn --version` e você deve ver algo como:

```
1.22.10
```

## Passo 1

Neste passo vamos deixar a infra-estrutura base do nosso projeto funcionando para poder evoluir até chegar no nosso servidor GraphQL.

No diretório em que está o repositório, nós vamos instalar a biblioteca GraphQL para node.js. Para isso digite:

```
    yarn add graphql
```

Agora vamos validar a instalação com o Hello World do GraphQL. Em um arquivo chamado index.js vamos colocar o seguinte:

```
var { graphql, buildSchema } = require('graphql')

// Criando o schema, usando a linguagem de schemas do GraphQL
var schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// O objeto root precisa prover resolvers para todos os métodos do schema
var root = {
  hello: () => {
    return 'Hello world!'
  },
}

// Rodamos a query GraphQL '{ hello }' e imprimimos a resposta
graphql(schema, '{ hello }', root).then((response) => {
  console.log(response)
})
```

Rodando `node index.js` você deve ver o resultado parecido com:

```
{ data: [Object: null prototype] { hello: 'Hello world!' } }
```

Isso quer dizer que nosso schema e nossa query foram processados corretamente.

## Passo 2

Caso você tenha dificuldades no passo anterior mas quer seguir o Workshop, digite no repositório:

```
    git checkout step1
```

Esse comando vai levar você para o final do passo 1.

Nesse segundo passo, nós vamos usar o framework web Express para ter um serviço HTTP GraphQL que aceita queries e permite que possamos evoluir nosso schema.

O primeiro passo é instalar as dependências:

```
    yarn add express express-graphql graphql
```

Agora voltando ao nosso `index.js`, vamos mudar para usar express:

```
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
```

Novamente, rodando com `node index.js` dessa vez o resultado deve ser algo como:

```
API GraphQL está rodando em http://localhost:4000/graphql...

Para acessar o GraphiQL basta colocar http://localhost:4000/graphql no seu browser.
```

Indo até esse endereço no browser, deve aparecer a interface do GraphiQL. Digite a query abaixo e aperte o botão de play. O resultado deve ser similar ao visto na imagem.

![GitHub Logo](/graphiql.png)
