import { join } from 'path';

import { isDev } from '@/src/shared/utils/is-dev.util';

import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';

export function getGraphQLConfig(
	confiService: ConfigService,
): ApolloDriverConfig {
	return {
		playground: isDev(confiService),
		path: confiService.getOrThrow<string>('GRAPHQL_PREFIX'),
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
		sortSchema: true,
		context: ({ req, res }) => ({ req, res }),
	};
}
