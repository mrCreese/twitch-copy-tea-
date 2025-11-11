import { AccountModule } from '../module/auth/account/account.module';
import { SessionModule } from '../module/auth/session/session.module';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';

import { getGraphQLConfig } from './config/graph.config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
	imports: [
		ConfigModule.forRoot({ ignoreEnvFile: !IS_DEV_ENV, isGlobal: true }),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			useFactory: getGraphQLConfig,
			imports: [ConfigModule],
			inject: [ConfigService],
		}),
		PrismaModule,
		RedisModule,
		AccountModule,
		SessionModule,
	],
})
export class CoreModule {}
