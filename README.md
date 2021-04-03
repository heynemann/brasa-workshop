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
const { graphql, buildSchema } = require('graphql')

// Criando o schema, usando a linguagem de schemas do GraphQL
const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// O objeto root precisa prover resolvers para todos os métodos do schema
const root = {
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
const express = require('express') // Web Framework
const { graphqlHTTP } = require('express-graphql') // Ponte entre GraphQL e Express
const { buildSchema } = require('graphql') // Mesma função que usamos no passo 1

// Novamente mesma função para construir nosso schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// Novamente precisamos prover o que deve ser executado em cada resolver
const root = {
  hello: () => {
    return 'Hello world!'
  },
}

// Agora configuramos o express para usar o nosso schema GraphQL
const app = express()
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
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Novamente mesma função para construir nosso schema
const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
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
  rollThreeDice: () => {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6))
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
```

Basta rodar novamente `node index.js` e acessar http://localhost:4000/graphql no seu browser para ver as novas queries.

Estes três exemplos de queries mostram como APIs GraphQL podem retornar tipos diferentes.

![GraphiQL](/graphiql2.png)

Na imagem acima, podemos ver algumas coisas interessantes:

- Primeiro uma das capacidades mais relevantes do GraphQL, que é poder fazer múltiplas queries em uma mesma requisição. No exemplo da imagem, estamos pedindo a `quoteOfTheDay`, `random`e `rollThreeDice` em uma mesma requisição. Essa capacidade é muito importante para performance, principalmente em aplicações web mobile, onde cada requisição tem um impacto grande em performance.
- Além disso, se você olhar no canto direito vai ver uma documentação das funções que são exportadas pelo nosso schema. Isso é proposital. O modelo que o GraphQL segue é inspecionável, isto é, permite que programaticamente possamos descobrir quais funções, campos, objetos, existem no nosso schema. É assim que o GraphiQL consegue prover essa documentação e o autocomplete, bem como validar se nossa query faz sentido para esse schema.

## Passo 4

Assim como APIs REST, é bem comum passar argumentos para uma função GraphQL. Nós definimos os argumentos que podem ser usados no schema, e a validação dos tipos acontece automaticamente. Cada argumento precisa ser nomeado e ter um tipo. Por exemplo, no passo 3 nós tínhamos uma função chamada `rollThreeDice`:

```
type Query {
  rollThreeDice: [Int]
}
```

Ao invés de fixar que vão ser 3 dados, nós poderíamos ter uma forma mais genérica que rola `numDice` dados, cada um tendo `numSides` lados. O nosso schema fica assim:

```
type Query {
  rollDice(numDice: Int!, numSides: Int): [Int]
}
```

A exclamação em `Int!` indica que `numDice` não pode ser nulo, o que permite que pulemos um pouco da validação no nosso resolver. Podemos deixar numSides ser nulo e assumir 6 lados como padrão, caso isso aconteça.

Até agora nosso resolver (função que implementa o schema) não recebia argumentos. Quando um resolver recebe argumentos, eles são passados como um objeto chamado "args", como primeiro argumento da nossa função. Logo a implementação de rollDice poderia ser algo como:

```
const root = {
  rollDice: (args) => {
    const output = [];
    for (let i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  }
};
```

Vamos atualizar nosso `index.js` para cobrir a nossa nova função:

```
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
 
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);
 
// The root provides a resolver function for each API endpoint
const root = {
  rollDice: ({numDice, numSides}) => {
    const output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};
 
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
```

Quando chamarmos esta API, precisamos passar os argumentos usando seus nomes e tipos corretos. 

Caso tentemos chamar nossa nova query sem passar os argumentos, recebemos um erro como o abaixo:

![GraphiQL](/graphiql3.png)

Para a nossa implementação, uma query possível para rolar três dados de seis lados poderia ser:

```
{
  rollDice(numDice: 3, numSides: 6)
}
```

![GraphiQL](/graphiql4.png)


Quando formos passar os argumentos em código, o ideal é evitar construir a query inteira nós mesmos. Ao invés disso podemos usar a sintaxe de `$` para definir variáveis em nossa query, e passar as variáveis em um objeto separado.

Por exemplo, vamos colocar o seguinte código em um arquivo `client.js`:

```
const fetch = require('node-fetch')

const dice = 3
const sides = 6
const query = `query RollDice($dice: Int!, $sides: Int) {
  rollDice(numDice: $dice, numSides: $sides)
}`

fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { dice, sides },
  }),
})
  .then((r) => r.json())
  .then((data) => console.log('resultado:', data))
```

Usando `$dice` e `$sides` como variáveis em GraphQL significa que não temos que nos preocupar com escapar variáveis do lado do cliente.

Para que nosso cliente funcione, é necessário instalar a biblioteca `node-fetch` que implementa a função `fetch` para node-js.

Agora nosso teste final. Em uma aba do terminal rode `node index.js` e espere o nosso servidor estar rodando. Em outra aba, digite `node client.js`. Você deve ver algo como:

```
resultado: { data: { rollDice: [ 1, 4, 5 ] } }
```

Como podemos ver, uma requisição para uma API GraphQL é simplesmente uma requisição HTTP. Apesar do protocolo HTTP não ser obrigatório para GraphQL (pode ser usado qualquer protocolo de comunicação), é definitivamente a implementação mais comum.
