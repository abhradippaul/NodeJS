import express from 'express';
import { config } from 'dotenv';
import connectDB from './db/index.js';
import restRoutes from './routes/rest.js';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const schema = buildSchema(`
  # A book has a title, author, and publication year
  type Book {
    id: ID!
    title: String!
    author: String!
    year: Int
    genre: String
  }

  # The "Query" type is the root of all GraphQL queries
  type Query {
    # Get all books
    books: [Book!]!
    # Get a specific book by ID
    book(id: ID!): Book
    # Search books by title or author
    searchBooks(query: String!): [Book!]!
  }
`);

// Define resolvers for the schema fields
const root = {
    // Resolver for fetching all books
    books: () => books,

    // Resolver for fetching a single book by ID
    book: ({ id }) => books.find(book => book.id === id),

    // Resolver for searching books
    searchBooks: ({ query }) => {
        const searchTerm = query.toLowerCase();
        return books.filter(
            book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm)
        );
    }
};

// Set up the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    // Enable the GraphiQL interface for testing
    graphiql: true,
}));

// Home endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to api architectures' });
});

// Mount REST API routes under /rest
app.use('/rest', restRoutes);

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((e) => {
    console.log(`Server facing error ${e}`)
})

