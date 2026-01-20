import type { NextFunction, Request, Response } from 'express';
import * as getRawBody from 'raw-body';

import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		if (!req.readable) {
			return next(new BadRequestException('request dati non validi'));
		}
		getRawBody(req, { encoding: 'utf-8' })
			.then(rawBody => {
				req.body = rawBody;
				next();
			})
			.catch(error => {
				throw new BadRequestException(
					'Errore durante recupero: ',
					error,
				);
				next(error);
			});
	}
}
