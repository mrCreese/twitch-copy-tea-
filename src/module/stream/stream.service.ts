import { PrismaService } from '@/src/core/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll() {
		const streams = await this.prismaService.stream.findMany({
			where: { user: { isDeactivated: false } },
			include: { user: { where: { isDeactivated: false } } },
		});

		return streams;
	}
}
