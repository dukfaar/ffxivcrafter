'use strict'

const mongoose = require('mongoose')
const CraftingProject = mongoose.model('CraftingProject')
const ProjectStepDB = mongoose.model('ProjectStep')

const _ = require('lodash')

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean
} = require('graphql')
const graphqlHTTP = require('express-graphql')

let ProjectStep = new GraphQLObjectType({
  name: 'ProjectStep',
  fields: () => {
    return {
      _id: { type: GraphQLID },
      inputs: { type: new GraphQLList(ProjectStep) }
    }
  }
})

let ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => {
    return {
      _id: { type: GraphQLID },
      name: { type: GraphQLString },
      tree: { type: GraphQLID },
      public: { type: GraphQLBoolean },
      private: { type: GraphQLBoolean }
    }
  }
})

let ProjectStepQuery = {
  projectStep: {
    type: ProjectStep,
    args: {
      id: { type: GraphQLID }
    },
    resolve: (root, {id}, source, fieldASTS) => {
      return new Promise((resolve, reject) => {
        ProjectStepDB.findById(id).exec()
        .then(step => resolve(step))
        .catch(err => reject(err))
      })
    }
  },
  projectSteps: {
    type: new GraphQLList(ProjectStep),
    resolve: () => {
      return new Promise((resolve, reject) => {
        ProjectStepDB.find().exec()
        .then(steps => resolve(steps))
        .catch(err => reject(err))
      })
    }
  }
}

let ProjectQuery = {
  projects: {
    type: new GraphQLList(ProjectType),
    resolve: () => {
      return new Promise((resolve, reject) => {
        CraftingProject.find().exec()
        .then(projects => resolve(projects))
        .catch(err => reject(err))
      })
    }
  }
}

var graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => {
      let result = {}

      _.extend(result,
        ProjectStepQuery,
        ProjectQuery
      )

      return result
    }
  })
})

module.exports = function (myPackage, app, auth, db) {
  app.use('/api/graphql', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
  }))
}
