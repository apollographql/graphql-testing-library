import {
  type GraphQLResolveInfo,
  GraphQLScalarType,
  type GraphQLScalarTypeConfig,
} from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
};

export type Book = {
  id: Scalars["ID"]["output"];
  publishedAt?: Maybe<Scalars["Date"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
};

/** An user's saved cart session. Only one cart can be active at a time */
export type Cart = {
  __typename?: "Cart";
  /** Items saved in the cart session */
  items?: Maybe<Array<Maybe<Product>>>;
  /** The current total of all the items in the cart, before taxes and shipping */
  subtotal?: Maybe<Scalars["Float"]["output"]>;
};

export type ColoringBook = Book & {
  __typename?: "ColoringBook";
  colors?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  id: Scalars["ID"]["output"];
  publishedAt?: Maybe<Scalars["Date"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
};

export enum ContractVariantFailedStep {
  AddDirectiveDefinitionsIfNotPresent = "ADD_DIRECTIVE_DEFINITIONS_IF_NOT_PRESENT",
  AddInaccessibleSpecPurpose = "ADD_INACCESSIBLE_SPEC_PURPOSE",
  DirectiveDefinitionLocationAugmenting = "DIRECTIVE_DEFINITION_LOCATION_AUGMENTING",
  EmptyEnumMasking = "EMPTY_ENUM_MASKING",
  EmptyInputObjectMasking = "EMPTY_INPUT_OBJECT_MASKING",
  EmptyObjectAndInterfaceFieldMasking = "EMPTY_OBJECT_AND_INTERFACE_FIELD_MASKING",
  EmptyObjectAndInterfaceMasking = "EMPTY_OBJECT_AND_INTERFACE_MASKING",
  EmptyUnionMasking = "EMPTY_UNION_MASKING",
  InputValidation = "INPUT_VALIDATION",
  Parsing = "PARSING",
  ParsingTagDirectives = "PARSING_TAG_DIRECTIVES",
  PartialInterfaceMasking = "PARTIAL_INTERFACE_MASKING",
  SchemaRetrieval = "SCHEMA_RETRIEVAL",
  TagInheriting = "TAG_INHERITING",
  TagMatching = "TAG_MATCHING",
  ToApiSchema = "TO_API_SCHEMA",
  ToFilterSchema = "TO_FILTER_SCHEMA",
  Unknown = "UNKNOWN",
  UnreachableTypeMasking = "UNREACHABLE_TYPE_MASKING",
  VersionCheck = "VERSION_CHECK",
}

export type EntitiesError = {
  __typename?: "EntitiesError";
  message: Scalars["String"]["output"];
};

export type EntitiesErrorResponse = {
  __typename?: "EntitiesErrorResponse";
  errors: Array<EntitiesError>;
};

export type EntitiesResponse = {
  __typename?: "EntitiesResponse";
  entities: Array<Entity>;
};

export type EntitiesResponseOrError = EntitiesErrorResponse | EntitiesResponse;

export type Entity = {
  __typename?: "Entity";
  typename: Scalars["String"]["output"];
};

export type Money = {
  __typename?: "Money";
  amount?: Maybe<Scalars["Float"]["output"]>;
  currency?: Maybe<Scalars["String"]["output"]>;
};

/** Returns information about a specific purchase */
export type Order = {
  __typename?: "Order";
  /** The user who made the purchase */
  buyer: User;
  /** Each order has a unique id which is separate from the user or items they bought */
  id: Scalars["ID"]["output"];
  /** A list of all the items they purchased. */
  items: Array<Product>;
  /** Calculate the cost to ship all the variants to the users address */
  shippingCost?: Maybe<Scalars["Float"]["output"]>;
  total?: Maybe<Money>;
};

/** Search filters for when showing an users previous purchases */
export type OrderFilters = {
  itemsInOrder?: InputMaybe<Scalars["Int"]["input"]>;
  orderId: Scalars["ID"]["input"];
  priceHigh?: InputMaybe<Scalars["Float"]["input"]>;
  priceLow?: InputMaybe<Scalars["Float"]["input"]>;
};

/** A specific product sold by our store. This contains all the high level details but is not the purchasable item. */
export type Product = {
  __typename?: "Product";
  averageRating?: Maybe<Scalars["Float"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  mediaUrl?: Maybe<Scalars["String"]["output"]>;
  price?: Maybe<Money>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  title?: Maybe<Scalars["String"]["output"]>;
  weight?: Maybe<Scalars["Float"]["output"]>;
};

/** Search filters for when returning Products */
export type ProductSearchInput = {
  titleStartsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  /** Get a specific order by id. Meant to be used for a detailed view of an order */
  order?: Maybe<Order>;
  /** Get a specific product by id. Useful for the product details page or checkout page */
  product?: Maybe<Product>;
  /** Top products for home display */
  products?: Maybe<Array<Maybe<Product>>>;
  /** Get all available products to shop for. Optionally provide some search filters */
  searchProducts?: Maybe<Array<Maybe<Product>>>;
  /**
   * Get the current user from our fake "auth" headers
   * Set the "x-user-id" header to the user id.
   */
  viewer?: Maybe<User>;
};

export type QueryOrderArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryProductArgs = {
  id: Scalars["ID"]["input"];
};

export type QuerySearchProductsArgs = {
  searchInput?: ProductSearchInput;
};

export type ReadableObject = {
  text?: Maybe<Scalars["String"]["output"]>;
};

export type Review = {
  __typename?: "Review";
  content?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  rating?: Maybe<Scalars["Float"]["output"]>;
};

export type TextBook = Book &
  ReadableObject & {
    __typename?: "TextBook";
    id: Scalars["ID"]["output"];
    publishedAt?: Maybe<Scalars["Date"]["output"]>;
    text?: Maybe<Scalars["String"]["output"]>;
    title?: Maybe<Scalars["String"]["output"]>;
  };

/** An user account in our system */
export type User = {
  __typename?: "User";
  /** The user's active cart session. Once the cart items have been purchases, they transition to an Order */
  cart?: Maybe<Cart>;
  id: Scalars["ID"]["output"];
  /** The users previous purchases */
  orders?: Maybe<Array<Maybe<Order>>>;
  /** The users current saved shipping address */
  shippingAddress?: Maybe<Scalars["String"]["output"]>;
  /** The users login username */
  username: Scalars["String"]["output"];
};

/** An user account in our system */
export type UserOrdersArgs = {
  filters?: InputMaybe<OrderFilters>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  EntitiesResponseOrError: EntitiesErrorResponse | EntitiesResponse;
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> =
  {
    Book: ColoringBook | TextBook;
    ReadableObject: TextBook;
  };

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Book: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>["Book"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Cart: ResolverTypeWrapper<Cart>;
  ColoringBook: ResolverTypeWrapper<ColoringBook>;
  ContractVariantFailedStep: ContractVariantFailedStep;
  Date: ResolverTypeWrapper<Scalars["Date"]["output"]>;
  EntitiesError: ResolverTypeWrapper<EntitiesError>;
  EntitiesErrorResponse: ResolverTypeWrapper<EntitiesErrorResponse>;
  EntitiesResponse: ResolverTypeWrapper<EntitiesResponse>;
  EntitiesResponseOrError: ResolverTypeWrapper<
    ResolversUnionTypes<ResolversTypes>["EntitiesResponseOrError"]
  >;
  Entity: ResolverTypeWrapper<Entity>;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Money: ResolverTypeWrapper<Money>;
  Order: ResolverTypeWrapper<Order>;
  OrderFilters: OrderFilters;
  Product: ResolverTypeWrapper<Product>;
  ProductSearchInput: ProductSearchInput;
  Query: ResolverTypeWrapper<{}>;
  ReadableObject: ResolverTypeWrapper<
    ResolversInterfaceTypes<ResolversTypes>["ReadableObject"]
  >;
  Review: ResolverTypeWrapper<Review>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  TextBook: ResolverTypeWrapper<TextBook>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Book: ResolversInterfaceTypes<ResolversParentTypes>["Book"];
  Boolean: Scalars["Boolean"]["output"];
  Cart: Cart;
  ColoringBook: ColoringBook;
  Date: Scalars["Date"]["output"];
  EntitiesError: EntitiesError;
  EntitiesErrorResponse: EntitiesErrorResponse;
  EntitiesResponse: EntitiesResponse;
  EntitiesResponseOrError: ResolversUnionTypes<ResolversParentTypes>["EntitiesResponseOrError"];
  Entity: Entity;
  Float: Scalars["Float"]["output"];
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  Money: Money;
  Order: Order;
  OrderFilters: OrderFilters;
  Product: Product;
  ProductSearchInput: ProductSearchInput;
  Query: {};
  ReadableObject: ResolversInterfaceTypes<ResolversParentTypes>["ReadableObject"];
  Review: Review;
  String: Scalars["String"]["output"];
  TextBook: TextBook;
  User: User;
};

export type DeferDirectiveArgs = {
  if?: Maybe<Scalars["Boolean"]["input"]>;
  label?: Maybe<Scalars["String"]["input"]>;
};

export type DeferDirectiveResolver<
  Result,
  Parent,
  ContextType = any,
  Args = DeferDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type BookResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Book"] = ResolversParentTypes["Book"],
> = {
  __resolveType: TypeResolveFn<
    "ColoringBook" | "TextBook",
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  publishedAt?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type CartResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Cart"] = ResolversParentTypes["Cart"],
> = {
  items?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Product"]>>>,
    ParentType,
    ContextType
  >;
  subtotal?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ColoringBookResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["ColoringBook"] = ResolversParentTypes["ColoringBook"],
> = {
  colors?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  publishedAt?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type EntitiesErrorResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["EntitiesError"] = ResolversParentTypes["EntitiesError"],
> = {
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntitiesErrorResponseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["EntitiesErrorResponse"] = ResolversParentTypes["EntitiesErrorResponse"],
> = {
  errors?: Resolver<
    Array<ResolversTypes["EntitiesError"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntitiesResponseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["EntitiesResponse"] = ResolversParentTypes["EntitiesResponse"],
> = {
  entities?: Resolver<Array<ResolversTypes["Entity"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntitiesResponseOrErrorResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["EntitiesResponseOrError"] = ResolversParentTypes["EntitiesResponseOrError"],
> = {
  __resolveType: TypeResolveFn<
    "EntitiesErrorResponse" | "EntitiesResponse",
    ParentType,
    ContextType
  >;
};

export type EntityResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Entity"] = ResolversParentTypes["Entity"],
> = {
  typename?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MoneyResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Money"] = ResolversParentTypes["Money"],
> = {
  amount?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Order"] = ResolversParentTypes["Order"],
> = {
  buyer?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes["Product"]>, ParentType, ContextType>;
  shippingCost?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  total?: Resolver<Maybe<ResolversTypes["Money"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Product"] = ResolversParentTypes["Product"],
> = {
  averageRating?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  mediaUrl?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes["Money"]>, ParentType, ContextType>;
  reviews?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Review"]>>>,
    ParentType,
    ContextType
  >;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  order?: Resolver<
    Maybe<ResolversTypes["Order"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOrderArgs, "id">
  >;
  product?: Resolver<
    Maybe<ResolversTypes["Product"]>,
    ParentType,
    ContextType,
    RequireFields<QueryProductArgs, "id">
  >;
  products?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Product"]>>>,
    ParentType,
    ContextType
  >;
  searchProducts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Product"]>>>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchProductsArgs, "searchInput">
  >;
  viewer?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
};

export type ReadableObjectResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["ReadableObject"] = ResolversParentTypes["ReadableObject"],
> = {
  __resolveType: TypeResolveFn<"TextBook", ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type ReviewResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Review"] = ResolversParentTypes["Review"],
> = {
  content?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TextBookResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["TextBook"] = ResolversParentTypes["TextBook"],
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  publishedAt?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  text?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = {
  cart?: Resolver<Maybe<ResolversTypes["Cart"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  orders?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Order"]>>>,
    ParentType,
    ContextType,
    Partial<UserOrdersArgs>
  >;
  shippingAddress?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Book?: BookResolvers<ContextType>;
  Cart?: CartResolvers<ContextType>;
  ColoringBook?: ColoringBookResolvers<ContextType>;
  Date?: GraphQLScalarType;
  EntitiesError?: EntitiesErrorResolvers<ContextType>;
  EntitiesErrorResponse?: EntitiesErrorResponseResolvers<ContextType>;
  EntitiesResponse?: EntitiesResponseResolvers<ContextType>;
  EntitiesResponseOrError?: EntitiesResponseOrErrorResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  Money?: MoneyResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReadableObject?: ReadableObjectResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  TextBook?: TextBookResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  defer?: DeferDirectiveResolver<any, any, ContextType>;
};
