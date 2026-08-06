import { hash } from 'argon2';

import { Prisma, PrismaClient } from '../../../prisma/generated';

import { BadRequestException, Logger } from '@nestjs/common';

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
});

async function main() {
	try {
		Logger.log('Inizio inserimento dati nell banca dati');

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socailLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany(),
		]);
		await prisma.category.createMany({ data: categoriesData });
		Logger.log('Categories created with success');

		const categories = await prisma.category.findMany();
		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category]),
		);
		await prisma.$transaction(async tx => {
			for (const username of usernames) {
				const randomCatetgory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(
								Math.random() *
									Object.keys(categoriesBySlug).length,
							)
						]
					];

				const userExists = await tx.user.findUnique({
					where: { username },
				});

				if (!userExists) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@twichcopy.com`,
							password: await hash('12345678'),
							username,
							displayName: username,
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Telegram',
											url: `https://t.me/${username}`,
											position: 1,
										},
										{
											title: 'YouTube',
											url: `https://youtube.com/@${username}`,
											position: 2,
										},
									],
								},
							},
						},
					});
					const randomTitles = streamTitles[randomCatetgory.slug];
					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						];

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl: `/streams/${createdUser.username}.webp`,
							user: { connect: { id: createdUser.id } },
							category: { connect: { id: randomCatetgory.id } },
						},
					});
					Logger.log(
						`User "${createdUser.username}" and streams created with success`,
					);
				}
			}
		});
		Logger.log('All date created with success');
	} catch (error) {
		Logger.error(error);
		throw new BadRequestException(
			'Errore durante inserimento in banca dati',
		);
	} finally {
		Logger.log('Chiusura connesione con la banca dati');

		await prisma.$disconnect();
		Logger.log('Connesione chiusa con la banca dati');
	}
}
main();

const categoriesData = [
	// --- GENERICHE / TEMATICHE ---
	{
		title: 'Just Chatting',
		slug: 'just-chatting',
		description: 'Chiacchiere libere e interazione con la community.',
		thumbnailUrl: '/categories/just-chatting.webp',
	},
	{
		title: 'Music',
		slug: 'music',
		description: 'Chiacchiere musicali e interazione con la community.',
		thumbnailUrl: '/categories/music.webp',
	},

	{
		title: 'Retro Gaming',
		slug: 'retro-gaming',
		description: 'Classici del passato e nostalgia videoludica.',
		thumbnailUrl: '/categories/retro-gaming.webp',
	},

	// --- GIOCHI SINGLE / FRANCHISE ---
	{
		title: 'Cyberpunk 2077',
		slug: 'cyberpunk-2077',
		description: 'Night City, build futuristiche e storyline.',
		thumbnailUrl: '/categories/cyberpunk-2077.webp',
	},
	{
		title: 'Dark Souls',
		slug: 'dark-souls',
		description: 'Sfida estrema e boss leggendari.',
		thumbnailUrl: '/categories/dark-souls.webp',
	},

	{
		title: 'Grand Theft Auto V',
		slug: 'gta-v',
		description: 'Crimine, caos e modalità online.',
		thumbnailUrl: '/categories/gta-v.webp',
	},

	{
		title: 'Red Dead Redemption 2',
		slug: 'red-dead-redemption-2',
		description: 'Avventura western e storytelling.',
		thumbnailUrl: '/categories/red-dead-redemption-2.webp',
	},
	{
		title: 'The Witcher 3',
		slug: 'the-witcher-3',
		description: 'Fantasy, mostri e scelte narrative.',
		thumbnailUrl: '/categories/the-witcher-3.webp',
	},

	// --- MULTIPLAYER / LIVE SERVICE ---

	{
		title: 'Fortnite',
		slug: 'fortnite',
		description: 'Battle royale e creatività.',
		thumbnailUrl: '/categories/fortnite.webp',
	},
	{
		title: 'Call of Duty',
		slug: 'call-of-duty',
		description: 'Azione FPS veloce e multiplayer.',
		thumbnailUrl: '/categories/call-of-duty.webp',
	},

	// --- SURVIVAL / SANDBOX ---
	{
		title: 'Minecraft',
		slug: 'minecraft',
		description: 'Costruzione, survival e creatività.',
		thumbnailUrl: '/categories/minecraft.webp',
	},
];

const streamTitles: Record<string, string[]> = {
	// --- GENERICHE ---
	'just-chatting': [
		'Chiacchiere random con la chat',
		'Rispondo alle vostre domande',
		'Talk serale chill',
		'Parliamo di tutto',
		'Community night 💬',
		'Q&A con i follower',
		'Late night talk',
		'Reaction e commenti live',
		'Stream improvvisato',
		'Relax & chiacchiere',
	],

	music: [
		'Musica chill dal vivo 🎶',
		'Ascoltiamo musica insieme',
		'Talk musicali con la chat',
		'Playlist della community',
		'Scopriamo nuova musica',
		'Vibes musicali',
		'Serata musica & relax',
		'Commentiamo album e artisti',
		'Musica in sottofondo + chat',
		'Chill music stream',
	],

	'retro-gaming': [
		'Ritorno ai classici',
		'Retro night 🎮',
		'Vecchia scuola',
		'Nostalgia pura',
		'Capolavori senza tempo',
		'Gameplay old school',
		'Quando i giochi erano difficili',
		'Pixel vibes',
		'Sfida retrò',
		"Ricordi d'infanzia",
	],

	// --- GIOCHI SINGLE ---
	'cyberpunk-2077': [
		'Night City blind run',
		'Esploriamo Night City',
		'Build cyberpunk',
		'Story mode',
		'Missioni secondarie',
		'Cyber vibes',
		'Scelte difficili',
		'Gameplay futuristico',
		'Run immersiva',
		'Finale alternativo?',
	],

	'dark-souls': [
		'Prepare to die 💀',
		'Prima run blind',
		'Boss fight',
		'Tentativi infiniti',
		'Sfida estrema',
		'Build strength',
		'Lore & gameplay',
		'Dark Souls night',
		'Skill test',
		'No hit? forse',
	],

	'gta-v': [
		'Caos totale',
		'Story mode',
		'Missioni secondarie',
		'GTA chill',
		'Gameplay libero',
		'Momenti random',
		'Crimine & caos',
		'Serata GTA',
		'Open world fun',
		'Esploriamo la mappa',
	],

	'red-dead-redemption-2': [
		'Avventura western',
		'Story mode',
		'Esplorazione libera',
		'Vita da fuorilegge',
		'Caccia leggendaria',
		'Momenti cinematici',
		'Side quest',
		'Red Dead vibes',
		'Run immersiva',
		'Finale epico',
	],

	'the-witcher-3': [
		'Caccia ai mostri',
		'Story mode',
		'Scelte narrative',
		'Side quest leggendarie',
		'Build Geralt',
		'Lore & gameplay',
		'Fantasy vibes',
		'Run completa',
		'Espansioni',
		'Avventura epica',
	],

	// --- MULTIPLAYER ---
	fortnite: [
		'Battle royale',
		'Solo win?',
		'Squad con la chat',
		'Gameplay chill',
		'Drop caldo',
		'Endgame fight',
		'Creative mode',
		'Fortnite night',
		'Victory royale?',
		'Partite rapide',
	],

	'call-of-duty': [
		'FPS action',
		'Multiplayer frenzy',
		'Killstreak time',
		'Gameplay veloce',
		'Warm-up',
		'Ranked',
		'Caos totale',
		'Hardpoint',
		'Serata COD',
		'Tryhard mode',
	],

	// --- SURVIVAL ---
	minecraft: [
		'Nuovo mondo survival',
		'Costruiamo la base',
		'Hardcore mode',
		'Con la community',
		'Mega progetto',
		'Redstone time',
		'Esplorazione',
		'Build creativa',
		'Avventura infinita',
		'Minecraft chill',
	],
};

const usernames: string[] = [
	'creese',
	'shadowfox',
	'neonwolf',
	'pixelhunter',
	'darkorbit',
	'cyberghost',
	'nightblade',
	'voidrunner',
	'ironclaw',
	'frostbyte',
	'stormrider',
	'quantumx',
	'silentcrow',
	'redviper',
	'blacknova',
	'lunarsoul',
	'ghostunit',
	'toxicrain',
	'hyperdrive',
	'deadpixel',
	'skullzone',
	'bluecomet',
	'digitalash',
	'firebyte',
	'crypticone',
];
