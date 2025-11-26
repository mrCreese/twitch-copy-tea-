import { CronService } from './cron.service';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [CronService],
})
export class CronModule {}
