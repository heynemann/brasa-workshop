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

![GraphiQL](/graphiql.png)

## Passo 3

Na maioria dos casos, tudo que vamos precisar é especificar os tipos para a API usando o schema do GraphQL (aquele que passamos para a função `buildSchema`).

A linguagem de schema do GraphQL suporta os tipos escalares `String`, `Int`, `Float`, `Boolean`, e `ID`, e você pode usar esses diretamente no schema que é passado para a `buildSchema`.

Por padrão, todos os tipos são `nullable` - ou seja, é legítimo retornar `null` para qualquer um dos tipos escalares. No caso de querermos dizer que um tipo não pode ser nulo, vamos adicionar uma exclamação no como sufixo, como por exemplo `String!` para nos referirmos a uma string non-nullable.

Para usar um tipo de lista (0 ou mais itens em um array), vamos usar colchetes, logo `[Int]` é uma lista de inteiros.

No nosso caso, em que estamos usando JavaScript, cada um dos tipos mapeia diretamente para um tipo em JavaScript, logo você pode retornar exatamente o que usamos em JS (para inteiro, usamos inteiro, string usa string e assim por diante).

Vamos mudar o nosso `index.js` para ver os tipos escalares em uso:

```
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
```

Basta rodar novamente `node index.js` e acessar http://localhost:4000/graphql no seu browser para ver as novas queries.

Estes três exemplos de queries mostram como APIs GraphQL podem retornar tipos diferentes.

![GraphiQL](/graphiql.png)

Na imagem acima, podemos ver algumas coisas interessantes:

- Primeiro uma das capacidades mais relevantes do GraphQL, que é poder fazer múltiplas queries em uma mesma requisição. No exemplo da imagem, estamos pedindo a `quoteOfTheDay`, `random`e `rollThreeDice` em uma mesma requisição. Essa capacidade é muito importante para performance, principalmente em aplicações web mobile, onde cada requisição tem um impacto grande em performance.
- Além disso, se você olhar no canto direito vai ver uma documentação das funções que são exportadas pelo nosso schema. Isso é proposital. O modelo que o GraphQL segue é inspecionável, isto é, permite que programaticamente possamos descobrir quais funções, campos, objetos, existem no nosso schema. É assim que o GraphiQL consegue prover essa documentação e o autocomplete, bem como validar se nossa query faz sentido para esse schema.
