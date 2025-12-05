import { AccountModule } from '../module/auth/account/account.module';
import { DeactivateModule } from '../module/auth/deactivate/deactivate.module';
import { PasswordRecoveryModule } from '../module/auth/password-recovery/password-recovery.module';
import { ProfileModule } from '../module/auth/profile/profile.module';
import { SessionModule } from '../module/auth/session/session.module';
import { TotpModule } from '../module/auth/totp/totp.module';
import { VerificationModule } from '../module/auth/verification/verification.module';
import { CronModule } from '../module/cron/cron.module';
import { LivekitModule } from '../module/libs/livekit/livekit.module';
import { MailModule } from '../module/libs/mail/mail.module';
import { StorageModule } from '../module/libs/storage/storage.module';
import { StreamModule } from '../module/stream/stream.module';
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
		LivekitModule.registerAsync({}),
		PrismaModule,
		RedisModule,
		AccountModule,
		SessionModule,
		VerificationModule,
		MailModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule,
		CronModule,
		StorageModule,
		LivekitModule,
		ProfileModule,
		StreamModule,
	],
})
export class CoreModule {}
