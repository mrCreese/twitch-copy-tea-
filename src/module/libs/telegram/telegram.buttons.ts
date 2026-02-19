import { Markup } from 'telegraf';

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('📜 Miei followings', 'follows'),
			Markup.button.callback('👤 Visualizare profilo', 'me'),
		],
		[Markup.button.callback('🌐 Sito', 'http://localhost:3000')],
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			'⚙️ Impostazioni del account',
			'http://localhost:3000/dashboard/settings',
		),
	]),
};
