export const typeDefs = `#graphql
  type Item {
    name: String!,
    price: Float!,
    category: String!,
    description: String,
    inStock: Boolean,
    tags: [String]
  }

  type OrderItem {
  itemId: ID!
  quantity: Int!
  price: Float!
}

type ShippingAddress {
  street: String!
  city: String!
  state: String!
  postalCode: String!
  country: String!
}

enum OrderStatus {
  pending
  paid
  shipped
  delivered
  cancelled
}

type Order {
  id: ID!
  orderNumber: String!
  customerName: String!
  customerEmail: String!
  items: [OrderItem!]!
  totalAmount: Float!
  status: OrderStatus!
  shippingAddress: ShippingAddress!
  createdAt: String!
  updatedAt: String!
}

  input CreateItemInput {
    name: String!
    price: Int!
    category: String!
    description: String
    inStock: Boolean
    tags: [String]
  }

  type Query {
    items: [Item]
    item(id: String!): Item
    orders: [Order]
  }

  type Mutation {
    createItem(input: CreateItemInput!): Item
  }
`;
