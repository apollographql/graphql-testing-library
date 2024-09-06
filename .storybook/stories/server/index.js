import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import bodyParser from "body-parser";
import cors from "cors";

const PORT = 4000;
const pubsub = new PubSub();

const typeDefs = `#graphql
type Query {
  teams: [Team!]!
  team(id: ID): Team!
  coaches: [Coach!]!
  favoriteTeam: ID!
}

type Mutation {
  setCurrentTeam(team: ID!): Team!
}

type Team {
  id: ID!
  name: String!
  wins: Int!
  losses: Int!
  coach: Coach!
}

type Coach {
  id: ID!
  team: ID!
  name: String!
}

type Player {
  id: ID!
  name: String!
  position: String!
}

type Game {
  home: Team!
  away: Team!
  id: ID!
}

type Subscription {
  numberIncremented: Int
  score: Score
}

type Score {
  home: Int!
  away: Int!
}
`;

const coaches = [
  {
    id: "1",
    name: "Sandy Brondello",
  },
  {
    id: "2",
    name: "Becky Hammon",
  },
  {
    id: "3",
    name: "Curt Miller",
  },
];

const teams = [
  {
    id: "1",
    name: "New York Liberty",
    wins: 26,
    losses: 6,
  },
  {
    id: "2",
    name: "Las Vegas Aces",
    wins: 18,
    losses: 12,
  },
  {
    id: "3",
    name: "Los Angeles Sparks",
    wins: 7,
    losses: 24,
  },
  {
    id: "4",
    name: "Atlanta Dream",
    wins: 10,
    losses: 20,
  },
  {
    id: "5",
    name: "Chicago Sky",
    wins: 11,
    losses: 19,
  },
  {
    id: "6",
    name: "Connecticut Sun",
    wins: 22,
    losses: 8,
  },
  {
    id: "7",
    name: "Indiana Fever",
    wins: 15,
    losses: 16,
  },
  {
    id: "8",
    name: "Washington Mystics",
    wins: 9,
    losses: 22,
  },
  {
    id: "9",
    name: "Dallas Wings",
    wins: 8,
    losses: 22,
  },
  {
    id: "10",
    name: "Minnesota Lynx",
    wins: 23,
    losses: 8,
  },
  {
    id: "11",
    name: "Phoenix Mercury",
    wins: 16,
    losses: 16,
  },
  {
    id: "12",
    name: "Seattle Storm",
    wins: 19,
    losses: 11,
  },
  {
    id: "13",
    name: "Golden State Valkyries",
    wins: 0,
    losses: 0,
  },
];

let currentTeam = "1";

// Resolver map
const resolvers = {
  Query: {
    team(_parent, { id }) {
      console.log({ id });
      return teams.find((team) => team.id === (id || currentTeam));
    },
    teams() {
      console.log(teams);
      return teams;
    },
    coaches() {
      return coaches;
    },
  },
  Subscription: {
    score: {
      subscribe: () => {
        return pubsub.asyncIterator(["POINT_SCORED"]);
      },
    },
  },
  Mutation: {
    setCurrentTeam(_parent, { team }) {
      currentTeam = team;
      return teams.find((t) => t.id === team);
    },
  },
};

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

const score = { home: 0, away: 0 };
let currentNumber = 1;

function scorePoint() {
  currentNumber++;
  if (currentNumber % 2 === 0) {
    score.home += 2;
  } else {
    score.away += 2;
  }
  pubsub.publish("POINT_SCORED", { score });
  setTimeout(scorePoint, 1000);
}

// Start incrementing
scorePoint();

// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`,
  );
});
