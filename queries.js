import { gql } from '@apollo/client'

export const GET_TODOS = gql`
  query {
    queryTodo {
      id
      value
      completed
    }
  }
`

export const ADD_TODO = gql`
  mutation addTodo($todo: AddTodoInput!) {
    addTodo(input: [$todo]) {
      todo {
        id
        value
        completed
      }
    }
  }
`

export const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $todo: TodoPatch!) {
    updateTodo(input: { filter: { id: [$id] }, set: $todo }) {
      todo {
        id
        value
        completed
      }
    }
  }
`

export const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(filter: { id: [$id] }) {
      todo {
        id
      }
    }
  }
`

export const CLEAR_COMPLETED_TODOS = gql`
  mutation updateTodo {
    deleteTodo(filter: { completed: true }) {
      todo {
        id
      }
    }
  }
`
