import { getAliasesById, reverseHostname } from '@millihq/tfn-dynamodb-actions';
import { CloudFrontResultResponse } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { NotFoundError } from '../errors/not-found-error';
import { findAliasWithBasePath } from './find-alias-with-base-path';
import { splitUri } from './split-uri';

type GetAliasOptions = {
  dynamoDBClient: DynamoDB;
  dynamoDBTable: string;
  uri?: string;
};

/**
 * Gets the proxy config for an alias and returns it back to the viewer.
 *
 * @param options
 * @returns
 */
async function getAlias({
  dynamoDBClient,
  dynamoDBTable,
  uri,
}: GetAliasOptions): Promise<CloudFrontResultResponse> {
  if (!uri) {
    throw new NotFoundError('Empty alias is not allowed');
  }

  const [alias, basePath] = splitUri(uri);
  const hostnameRev = reverseHostname(alias);
  const aliasRecords = await getAliasesById({
    hostnameRev,
    basePath,
    aliasTableName: dynamoDBTable,
    dynamoDBClient,
    attributes: {
      BasePath: true,
      Routes: true,
      Prerenders: true,
      LambdaRoutes: true,
      DeploymentId: true,
    },
  });

  if (!aliasRecords) {
    throw new NotFoundError(`No Alias found for ${alias}`);
  }

  const aliasRecord = aliasRecords.length === 1 ? aliasRecords[0] : findAliasWithBasePath(aliasRecords);
  // For performance reasons we build the JSON response here manually, since
  // the records in the database are already stringified JSON objects.
  return {
    status: '200',
    body:
      '{"routes":' +
      aliasRecord.Routes +
      ',"lambdaRoutes":' +
      aliasRecord.LambdaRoutes +
      ',"prerenders":' +
      aliasRecord.Prerenders +
      ',"deploymentId":' +
      '"' +
      aliasRecord.DeploymentId +
      '"' +
      ',"basePath":' +
      '"' +
      aliasRecord.BasePath +
      '"' +
      '}',
    headers: {
      'cache-control': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000',
        },
      ],
      'content-type': [
        {
          key: 'Content-Type',
          value: 'application/json',
        },
      ],
    },
  };
}

export { getAlias };
