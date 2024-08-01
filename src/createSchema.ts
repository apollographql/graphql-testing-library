// import type { FieldNode, FragmentDefinitionNode, GraphQLSchema } from "graphql";
// import { addResolversToSchema } from "@graphql-tools/schema";
// import { mergeResolvers } from "@graphql-tools/merge";

// type ProxiedSchema = GraphQLSchema & TestSchemaFns;

// export interface FragmentMap {
//   [fragmentName: string]: FragmentDefinitionNode;
// }

// export type Resolver = (
//   rootValue?: any,
//   args?: any,
//   context?: any,
//   info?: {
//     field: FieldNode;
//     fragmentMap: FragmentMap;
//   },
// ) => any;

// interface Resolvers {
//   [key: string]: {
//     [field: string]: Resolver;
//   };
// }

// export interface TestSchemaFns {
//   add: (addOptions: { resolvers: Resolvers }) => ProxiedSchema;
//   fork: (forkOptions?: { resolvers?: Resolvers }) => ProxiedSchema;
//   reset: () => void;
// }

// interface TestSchemaOptions {
//   resolvers?: Resolvers;
// }

// /**
//  * A function that creates a [Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
//  * around a given `schema` with `resolvers`. This proxied schema can be used to
//  * progressively layer resolvers on top of the original schema using the `add`
//  * method. The `fork` method can be used to create a new proxied schema which
//  * can be modified independently of the original schema. `reset` will restore
//  * resolvers to the original proxied schema.
//  *
//  */
// const createTestSchema = (
//   schemaWithTypeDefs: GraphQLSchema,
//   options: TestSchemaOptions,
// ): ProxiedSchema => {
//   let targetResolvers = { ...options.resolvers };
//   let targetSchema = addResolversToSchema({
//     schema: schemaWithTypeDefs,
//     resolvers: targetResolvers,
//   });

//   const fns: TestSchemaFns = {
//     add: ({ resolvers: newResolvers }) => {
//       // @ts-ignore TODO(fixme): IResolvers type does not play well with our Resolvers
//       targetResolvers = mergeResolvers([targetResolvers, newResolvers]);

//       targetSchema = addResolversToSchema({
//         schema: targetSchema,
//         resolvers: targetResolvers,
//       });

//       return targetSchema as ProxiedSchema;
//     },

//     fork: ({ resolvers: newResolvers } = {}) => {
//       return createTestSchema(targetSchema, {
//         // @ts-ignore TODO(fixme): IResolvers type does not play well with our Resolvers
//         resolvers:
//           mergeResolvers([targetResolvers, newResolvers]) ?? targetResolvers,
//       });
//     },

//     reset: () => {
//       targetSchema = addResolversToSchema({
//         schema: schemaWithTypeDefs,
//         resolvers: options.resolvers || {},
//       });
//     },
//   };

//   const schema = new Proxy(targetSchema, {
//     get(_target, p) {
//       if (p in fns) {
//         return Reflect.get(fns, p);
//       }

//       // An optimization that eliminates round-trips through the proxy
//       // on class methods invoked via `this` on a base class instance wrapped by
//       // the proxy.
//       //
//       // For example, consider the following class:
//       //
//       // class Base {
//       //   foo(){
//       //     this.bar()
//       //   }
//       //   bar(){
//       //     ...
//       //   }
//       // }
//       //
//       // Calling `proxy.foo()` would call `foo` with `this` being the proxy.
//       // This would result in calling `proxy.bar()` which would again invoke
//       // the proxy to resolve `bar` and call that method.
//       //
//       // Instead, calls to `proxy.foo()` should result in a call to
//       // `innerObject.foo()` with a `this` of `innerObject`, and that call
//       // should directly call `innerObject.bar()`.

//       const property = Reflect.get(targetSchema, p);
//       if (typeof property === "function") {
//         return property.bind(targetSchema);
//       }
//       return property;
//     },
//   });

//   // let testSchema: GraphQLSchema = schema;

//   // const oldSchema = testSchema;

//   // testSchema = newSchema;

//   function restore() {
//     testSchema = oldSchema;
//   }

//   return Object.assign(schema, {
//     [Symbol.dispose]() {
//       restore();
//     },
//   }) as unknown as ProxiedSchema;

//   // return schema as ProxiedSchema;
// };

// export { createTestSchema };
