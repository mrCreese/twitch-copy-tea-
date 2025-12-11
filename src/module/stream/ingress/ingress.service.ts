import {
	CreateIngressOptions,
	IngressAudioEncodingPreset,
	IngressInput,
	IngressVideoEncodingPreset,
} from 'livekit-server-sdk';

import type { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { LivekitService } from '../../libs/livekit/livekit.service';

import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class IngressService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService,
	) {}

	async create(user: User, ingresstype: IngressInput) {
		await this.reaetIngresses(user);

		const options: CreateIngressOptions = {
			name: user.username,
			roomName: user.id,
			participantName: user.username,
			participantIdentity: user.id,
		};
		console.log(options);

		if (ingresstype === IngressInput.WHIP_INPUT) {
			options.bypassTranscoding = true;
		} else {
			options.video = {
				source: 1,
				preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
			};
			options.audio = {
				source: 2,
				preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
			};
		}

		const ingress = await this.livekitService.ingress.createIngress(
			ingresstype,
			options,
		);

		console.log(ingress);

		if (!ingress || !ingress.url || !ingress.streamKey) {
			throw new BadRequestException(
				'Non è stato possibile creare stream',
			);
		}

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: {
				ingresId: ingress.ingressId,
				serverUrl: ingress.url,
				streamKey: ingress.streamKey,
			},
		});

		return true;
	}

	private async reaetIngresses(user: User) {
		const ingresses = await this.livekitService.ingress.listIngress({
			roomName: user.id,
		});

		const rooms = await this.livekitService.room.listRooms([user.id]);

		for (const room of rooms) {
			await this.livekitService.room.deleteRoom(room.name);
		}

		for (const ingress of ingresses) {
			if (ingress.ingressId) {
				await this.livekitService.ingress.deleteIngress(
					ingress.ingressId,
				);
			}
		}
	}
}
