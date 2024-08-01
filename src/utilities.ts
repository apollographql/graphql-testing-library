import {
  type ASTNode,
  type GraphQLSchema,
  type GraphQLEnumValue,
  GraphQLEnumType,
  isUnionType,
  isObjectType,
  isScalarType,
  visit,
  BREAK,
} from "graphql";
import {
  type IMocks,
  type IScalarMock,
  type ITypeMock,
} from "@graphql-tools/mock";

export function hasDirectives(names: string[], root: ASTNode, all?: boolean) {
  const nameSet = new Set(names);
  const uniqueCount = nameSet.size;

  visit(root, {
    Directive(node) {
      if (nameSet.delete(node.name.value) && (!all || !nameSet.size)) {
        return BREAK;
      }
    },
  });

  // If we found all the names, nameSet will be empty. If we only care about
  // finding some of them, the < condition is sufficient.
  return all ? !nameSet.size : nameSet.size < uniqueCount;
}

// Generates a Map of possible types. The keys are Union | Interface type names
// which map to Sets of either union members or types that implement the
// interface.
export const createPossibleTypesMap = (executableSchema: GraphQLSchema) => {
  const typeMap = executableSchema.getTypeMap();
  const possibleTypesMap = new Map<string, Set<string>>();

  for (const typeName of Object.keys(typeMap)) {
    const type = typeMap[typeName];

    if (isUnionType(type) && !possibleTypesMap.has(typeName)) {
      possibleTypesMap.set(
        typeName,
        new Set(type.getTypes().map(({ name }) => name)),
      );
    }

    if (isObjectType(type) && type.getInterfaces().length > 0) {
      for (const interfaceType of type.getInterfaces()) {
        if (possibleTypesMap.has(interfaceType.name)) {
          const setOfTypes = possibleTypesMap.get(interfaceType.name);
          if (setOfTypes) {
            possibleTypesMap.set(interfaceType.name, setOfTypes.add(typeName));
          }
        } else {
          possibleTypesMap.set(interfaceType.name, new Set([typeName]));
        }
      }
    }
  }
  return possibleTypesMap;
};

// From a Map of possible types, create default resolvers with __resolveType
// functions that pick the first possible type if no __typename is present.
export const createDefaultResolvers = (typesMap: Map<string, Set<string>>) => {
  const defaultResolvers: {
    [key: string]: {
      __resolveType(data: { __typename?: string }): string;
    };
  } = {};

  for (const key of typesMap.keys()) {
    defaultResolvers[key] = {
      __resolveType(data) {
        return data.__typename || typesMap.get(key)?.values().next().value;
      },
    };
  }
  return defaultResolvers;
};

// Sorts enum values alphabetically.
const sortEnumValues = () => {
  const key = "value";
  return (a: GraphQLEnumValue, b: GraphQLEnumValue) =>
    a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
};

// TODO: memoize
// Creates a map of enum types and mock resolver functions that return
// the first possible value.
export const mockEnums = <TResolvers>(
  schema: GraphQLSchema,
): IMocks<TResolvers> => {
  // @ts-ignore
  return Object.fromEntries(
    Object.entries(schema.getTypeMap())
      .filter(
        (arg): arg is [string, GraphQLEnumType] =>
          arg[1] instanceof GraphQLEnumType,
      )
      .map(([typeName, type]) => {
        const value = type
          .getValues()
          .concat()
          .sort(sortEnumValues())[0]?.value;
        return [typeName, () => value] as const;
      }),
  );
};

export const mockCustomScalars = <Resolvers>(
  schema: GraphQLSchema,
): IMocks<Resolvers> => {
  const typeMap = schema.getTypeMap();

  const mockScalarsMap: {
    [typeOrScalarName: string]: IScalarMock | ITypeMock;
  } = {};

  for (const typeName of Object.keys(typeMap)) {
    const type = typeMap[typeName];
    // Only mock custom scalars
    if (isScalarType(type) && type.astNode) {
      mockScalarsMap[typeName] = () =>
        `Default value for custom scalar \`${typeName}\``;
    }
  }
  return mockScalarsMap as IMocks<Resolvers>;
};
