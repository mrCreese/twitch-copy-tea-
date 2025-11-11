import { SessionMetadata } from './session-metadata.types';

export interface UserSession {
	id: string;
	userId: string;
	createdAt: number; // o Date se preferisci, ma allora devi convertire
	metadata: SessionMetadata;
}
