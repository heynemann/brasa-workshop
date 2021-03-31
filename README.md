# brasa-workshop

Workshop de Jamstack e GraphQL para Brasa

## Requerimento

É necessário que você tenha uma versão moderna de Node.JS instalado na sua máquina. Sugerimos usar a v14.16.0 que é uma versão com suporte de longo prazo.

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
