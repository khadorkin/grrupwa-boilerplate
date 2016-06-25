import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  User,
  getItems,
  getItem,
  getUser,
  getViewer,
} from './database';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Item') {
      return getItem(id);
    } else if (type === 'User') {
      return getUser(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Item) {
      return GraphQLItem;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

const GraphQLItem = new GraphQLObjectType({
  name: 'Item',
  fields: {
    id: globalIdField('Item'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    category: {
      type: GraphQLString,
      resolve: (obj) => obj.category,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: ItemsConnection,
  edgeType: GraphQLItemEdge,
} = connectionDefinitions({
  name: 'Item',
  nodeType: GraphQLItem,
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    items: {
      type: ItemsConnection,
      args: {
        category: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, { category, ...args }) =>
        connectionFromArray(getItems(category), args),
    },
  },
  interfaces: [nodeInterface],
});

const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
    node: nodeField,
  },
});

export const schema = new GraphQLSchema({
  query: Root,
});
