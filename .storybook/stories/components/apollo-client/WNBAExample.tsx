import React, { Suspense, type ReactElement, type ReactNode } from "react";
import type { TypedDocumentNode } from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import {
  gql,
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  useSuspenseQuery,
  useMutation,
  useFragment,
  useSubscription,
} from "@apollo/client";

import { TeamLogo } from "../TeamLogo.js";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsUrl = "ws://localhost:4000/graphql";

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,
  }),
);

const definitionIsSubscription = (d: any) => {
  return d.kind === "OperationDefinition" && d.operation === "subscription";
};

const link = ApolloLink.split(
  (operation) => operation.query.definitions.some(definitionIsSubscription),
  wsLink,
  httpLink,
);

export const makeClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link,
    connectToDevTools: true,
  });

export const client = makeClient();

const TEAM_FRAGMENT = gql`
  fragment TeamFragment on Team {
    id
    name
    wins
    losses
  }
`;

const APP_QUERY: TypedDocumentNode<{
  team: {
    id: string;
    name: string;
    wins: number;
    losses: number;
  };
  teams: {
    name: string;
    id: string;
  }[];
}> = gql`
  query AppQuery {
    team {
      ...TeamFragment
    }
    teams {
      name
      id
    }
  }

  ${TEAM_FRAGMENT}
`;

const APP_MUTATION = gql`
  mutation SetCurrentTeam($team: ID!) {
    setCurrentTeam(team: $team) {
      ...TeamFragment
    }
  }
  ${TEAM_FRAGMENT}
`;

const APP_SUBSCRIPTION = gql`
  subscription GetCurrentScore {
    score {
      home
      away
    }
  }
`;

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
    </ApolloProvider>
  );
}

export function ApolloApp() {
  return (
    <Wrapper>
      <App />
    </Wrapper>
  );
}

export function App() {
  // Use useSuspenseQuery here because we want to demo the loading experience
  // with/without defer.
  const { data } = useSuspenseQuery(APP_QUERY);

  // this slug of the franchise name is used to set the theme name on the parent
  // div which corresponds to the theme names in tailwind.config.js
  const currentTeamSlug = data?.teams
    .find((team) => team.id === data?.team.id)
    ?.name.split(" ")
    .pop()
    ?.toLowerCase();

  return (
    <div
      className={`wnba ${currentTeamSlug} bg-primary w-screen h-screen p-10 pt-16 flex flex-col`}
    >
      <div className="marquee">
        <p>Welcome to the W 🏀</p>
      </div>

      <div
        className="text-7xl m-auto mt-0 mb-6"
        style={{
          textShadow: `0.03em 0.03em hsl(var(--twc-secondary)), 0.03em 0.03em hsl(var(--twc-secondary)), -0.03em -0.03em hsl(var(--twc-secondary))`,
        }}
      >
        WNBA stats central
      </div>
      <div className="flex flex-row">
        <BoxScore />
        <TeamSelect currentTeam={data?.team.id} teams={data?.teams} />
      </div>
      <div className="flex flex-row">
        <div className="flex-1 flex-col border-secondary border-y-4 border-l-4 p-4"></div>
        <div className="flex-1 flex-col border-secondary border-4 p-4">
          <Team team={data?.team.id} />
        </div>
      </div>
    </div>
  );
}

function BoxScore() {
  const { data } = useSubscription(APP_SUBSCRIPTION);

  return (
    <div className="border-secondary border-4 inline-flex p-4 text-2xl mb-10 mr-auto">
      <div className="text-center">
        <TeamLogo className="h-28 w-28 m-0 mb-4" team="4" />{" "}
        <span className="text-secondary">{data?.score?.home || 0}</span>
      </div>
      <div className="text-center">
        <TeamLogo className="h-28 w-28 m-0 mb-4" team="5" />{" "}
        <span className="text-secondary">{data?.score?.away || 0}</span>
      </div>
    </div>
  );
}

function TeamSelect({
  currentTeam,
  teams,
}: {
  currentTeam: string;
  teams: Array<{ name: string; id: string }>;
}) {
  const [setCurrentTeam] = useMutation(APP_MUTATION, {
    update(cache, { data: { setCurrentTeam } }) {
      cache.modify({
        fields: {
          team(_existingRef, { toReference }) {
            return toReference({
              __typename: "Team",
              id: setCurrentTeam.id,
            });
          },
        },
      });
    },
  });

  return (
    <div className="">
      <label htmlFor="teams" className="text-secondary">
        <span className="pr-4 text-4xl">My team:</span>
      </label>
      <select
        id="teams"
        className="text-4xl"
        defaultValue={currentTeam}
        onChange={(e) => {
          setCurrentTeam({
            variables: {
              team: e.currentTarget.value,
            },
          });
        }}
      >
        {teams.map(({ name, id }) => {
          return (
            <option value={id} key={id}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function Team({ team }: { team: string }) {
  const { data } = useFragment({
    fragment: TEAM_FRAGMENT,
    from: {
      __typename: "Team",
      id: team,
    },
  });

  return (
    <div className="ml-auto">
      <div className="">
        <TeamLogo team={data.id} />
      </div>
      {data ? (
        <>
          <p className="text-4xl text-secondary">Wins: {data?.wins}</p>
          <p className="text-4xl text-secondary">Losses: {data?.losses}</p>
        </>
      ) : null}
    </div>
  );
}
