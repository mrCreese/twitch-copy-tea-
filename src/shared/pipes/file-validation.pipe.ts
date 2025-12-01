import { ReadStream } from 'fs';

import { validateFileFormat, validateSizeFile } from '../utils/file.util';

import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	type PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileVsalidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		if (!value?.filename) {
			throw new BadRequestException('File non cricato');
		}

		const { filename, createReadStream } = value;

		const fileStream = createReadStream() as ReadStream;

		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];

		const isFileFormatValid = validateFileFormat(filename, allowedFormats);

		if (!isFileFormatValid) {
			throw new BadRequestException('Formato del file non valido');
		}

		const isFileSizeValid = await validateSizeFile(
			fileStream,
			10 * 1024 * 1024,
		);

		if (!isFileSizeValid) {
			throw new BadRequestException('Dimensioni del file superano ');
		}

		return value;
	}
}
