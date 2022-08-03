import { DynamoDB } from 'aws-sdk';

import { RouteItem } from '../types';

const { unmarshall } = DynamoDB.Converter;

type GetAliasByIdOptions = {
  /**
   * DynamoDB client
   */
  dynamoDBClient: DynamoDB;
  /**
   * Name of the table that holds the aliases.
   */
  aliasTableName: string;
  /**
   * Hostname of the route config that is requested.
   */
  hostnameRev: string;
  /**
   * Basepath of the route config that is requested.
   */
  basePath?: string;
  /**
   * Only return the attributes defined
   */
  attributes?: Partial<Record<keyof RouteItem, boolean>>;
};

/**
 * Function to find alias by "maybe" basePath
 * It's a work around the limitation of proxy having no knowledge about valid basePath values
 * If there is alias with basePath provided, it'll return both root and basePath aliases
 * otherwise only root alias will be returned
 * @param param0 
 * @returns 
 */
async function getAliasesById({
  dynamoDBClient,
  aliasTableName,
  hostnameRev,
  basePath = '/',
  attributes = {},
}: GetAliasByIdOptions): Promise<RouteItem[] | null> {
  const queryParams: DynamoDB.QueryInput = basePath === '/' ? {
    TableName: aliasTableName,
    ExpressionAttributeValues: {
      ':v1': {
        S: 'ROUTES',
      },
      ':v2': {
        S: `${hostnameRev}#/`,
      }
    },
    KeyConditionExpression: 'PK = :v1 and SK = :v2',
    Limit: 1,
  } : {
    TableName: aliasTableName,
    ExpressionAttributeValues: {
      ':v1': {
        S: 'ROUTES',
      },
      ':v2': {
        S: `${hostnameRev}#`,
      },
      ':v3': {
        S: basePath,
      },
      ':v4': {
        S: '/',
      },
    },
    KeyConditionExpression: 'PK = :v1 and begins_with(SK, :v2)',
    FilterExpression: 'BasePath in (:v3, :v4)',
    Limit: 2,
  };

  const projectionAttributes = Object.keys(attributes);
  if (projectionAttributes.length > 0) {
    queryParams.ProjectionExpression = projectionAttributes.join(', ');
  }

  const { Count, Items } = await dynamoDBClient.query(queryParams).promise();

  if (!Count) {
    return null;
  }

  return Items!.map((i) => unmarshall(i)) as RouteItem[];
}

export { getAliasesById };
