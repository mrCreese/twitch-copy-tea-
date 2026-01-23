import { PrismaClient } from '@/prisma/generated';

import { BadRequestException, Logger } from '@nestjs/common';

const prisma = new PrismaClient();

async function main() {
	try {
		Logger.log('Inizio inserimento dati nell banca dati');

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socailLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany(),
		]);
	} catch (error) {
		Logger.log(error);
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



const categoriesData=export const categories = [
  // --- GENERICHE / TEMATICHE ---
  {
    title: "Just Chatting",
    slug: "just-chatting",
    description: "Chiacchiere libere e interazione con la community.",
    thumbnailUrl: "/categories/just-chatting.webp",
  },
  {
    title: "Gaming Competitivo",
    slug: "gaming-competitivo",
    description: "Ranked, tornei e gameplay ad alto livello.",
    thumbnailUrl: "/categories/gaming-competitivo.webp",
  },
  {
    title: "Indie Games",
    slug: "indie-games",
    description: "Scoperta di giochi indie e titoli alternativi.",
    thumbnailUrl: "/categories/indie-games.webp",
  },
  {
    title: "Retro Gaming",
    slug: "retro-gaming",
    description: "Classici del passato e nostalgia videoludica.",
    thumbnailUrl: "/categories/retro-gaming.webp",
  },
  {
    title: "Horror Games",
    slug: "horror-games",
    description: "Esperienze horror, jumpscare e tensione.",
    thumbnailUrl: "/categories/horror-games.webp",
  },
  {
    title: "FPS & Shooter",
    slug: "fps-shooter",
    description: "Azione frenetica e scontri a fuoco.",
    thumbnailUrl: "/categories/fps-shooter.webp",
  },
  {
    title: "MMORPG",
    slug: "mmorpg",
    description: "Avventure online, grinding e raid.",
    thumbnailUrl: "/categories/mmorpg.webp",
  },
  {
    title: "Roleplay",
    slug: "roleplay",
    description: "Storie immersive e interpretazione di personaggi.",
    thumbnailUrl: "/categories/roleplay.webp",
  },
  {
    title: "Speedrun",
    slug: "speedrun",
    description: "Completare giochi nel minor tempo possibile.",
    thumbnailUrl: "/categories/speedrun.webp",
  },
  {
    title: "IRL Streaming",
    slug: "irl-streaming",
    description: "Streaming nella vita reale.",
    thumbnailUrl: "/categories/irl-streaming.webp",
  },

  // --- GIOCHI SINGLE / FRANCHISE ---
  {
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    description: "Night City, build futuristiche e storyline.",
    thumbnailUrl: "/categories/cyberpunk-2077.webp",
  },
  {
    title: "Dark Souls",
    slug: "dark-souls",
    description: "Sfida estrema e boss leggendari.",
    thumbnailUrl: "/categories/dark-souls.webp",
  },
  {
    title: "Elden Ring",
    slug: "elden-ring",
    description: "Open world soulslike e combattimenti epici.",
    thumbnailUrl: "/categories/elden-ring.webp",
  },
  {
    title: "Bloodborne",
    slug: "bloodborne",
    description: "Atmosfere gotiche e combattimenti frenetici.",
    thumbnailUrl: "/categories/bloodborne.webp",
  },
  {
    title: "Sekiro",
    slug: "sekiro",
    description: "Combattimento tecnico e precisione assoluta.",
    thumbnailUrl: "/categories/sekiro.webp",
  },
  {
    title: "Grand Theft Auto V",
    slug: "gta-v",
    description: "Crimine, caos e modalità online.",
    thumbnailUrl: "/categories/gta-v.webp",
  },
  {
    title: "GTA Roleplay",
    slug: "gta-roleplay",
    description: "Roleplay narrativo su server GTA.",
    thumbnailUrl: "/categories/gta-roleplay.webp",
  },
  {
    title: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    description: "Avventura western e storytelling.",
    thumbnailUrl: "/categories/red-dead-redemption-2.webp",
  },
  {
    title: "The Witcher 3",
    slug: "the-witcher-3",
    description: "Fantasy, mostri e scelte narrative.",
    thumbnailUrl: "/categories/the-witcher-3.webp",
  },
  {
    title: "Skyrim",
    slug: "skyrim",
    description: "Mod, esplorazione e avventure epiche.",
    thumbnailUrl: "/categories/skyrim.webp",
  },

  // --- MULTIPLAYER / LIVE SERVICE ---
  {
    title: "League of Legends",
    slug: "league-of-legends",
    description: "MOBA competitivo e ranked.",
    thumbnailUrl: "/categories/league-of-legends.webp",
  },
  {
    title: "Valorant",
    slug: "valorant",
    description: "FPS tattico e abilità degli agenti.",
    thumbnailUrl: "/categories/valorant.webp",
  },
  {
    title: "Counter-Strike 2",
    slug: "counter-strike-2",
    description: "Shooter competitivo e precisione.",
    thumbnailUrl: "/categories/counter-strike-2.webp",
  },
  {
    title: "Fortnite",
    slug: "fortnite",
    description: "Battle royale e creatività.",
    thumbnailUrl: "/categories/fortnite.webp",
  },
  {
    title: "Call of Duty",
    slug: "call-of-duty",
    description: "Azione FPS veloce e multiplayer.",
    thumbnailUrl: "/categories/call-of-duty.webp",
  },
  {
    title: "Apex Legends",
    slug: "apex-legends",
    description: "Battle royale frenetico a squadre.",
    thumbnailUrl: "/categories/apex-legends.webp",
  },
  {
    title: "Overwatch 2",
    slug: "overwatch-2",
    description: "Hero shooter e gioco di squadra.",
    thumbnailUrl: "/categories/overwatch-2.webp",
  },

  // --- SURVIVAL / SANDBOX ---
  {
    title: "Minecraft",
    slug: "minecraft",
    description: "Costruzione, survival e creatività.",
    thumbnailUrl: "/categories/minecraft.webp",
  },
  {
    title: "Rust",
    slug: "rust",
    description: "Survival hardcore e PvP.",
    thumbnailUrl: "/categories/rust.webp",
  },
  {
    title: "ARK Survival",
    slug: "ark-survival",
    description: "Dinosauri, crafting e sopravvivenza.",
    thumbnailUrl: "/categories/ark-survival.webp",
  },
  {
    title: "Valheim",
    slug: "valheim",
    description: "Survival cooperativo a tema vichingo.",
    thumbnailUrl: "/categories/valheim.webp",
  },
  {
    title: "Subnautica",
    slug: "subnautica",
    description: "Esplorazione subacquea e survival.",
    thumbnailUrl: "/categories/subnautica.webp",
  },

  // --- VARI / CASUAL ---
  {
    title: "Among Us",
    slug: "among-us",
    description: "Party game e deduzione sociale.",
    thumbnailUrl: "/categories/among-us.webp",
  },
  {
    title: "Fall Guys",
    slug: "fall-guys",
    description: "Caos colorato e competizioni casual.",
    thumbnailUrl: "/categories/fall-guys.webp",
  },
  {
    title: "Hades",
    slug: "hades",
    description: "Roguelike action e mitologia.",
    thumbnailUrl: "/categories/hades.webp",
  },
  {
    title: "Stardew Valley",
    slug: "stardew-valley",
    description: "Relax, farming e vita di villaggio.",
    thumbnailUrl: "/categories/stardew-valley.webp",
  },
  {
    title: "Dead by Daylight",
    slug: "dead-by-daylight",
    description: "Horror multiplayer asimmetrico.",
    thumbnailUrl: "/categories/dead-by-daylight.webp",
  },
];
