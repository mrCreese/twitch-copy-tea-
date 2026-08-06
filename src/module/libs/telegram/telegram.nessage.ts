import type { SponsorshipPlan, User } from '@/prisma/generated';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';

export const MESSAGES = {
	welcome:
		`<b>👋 Benvenuto in TeaStreamCreese Bot!</b>\n\n` +
		`Per ricevere avvisi e migliorare la tua esperienza sulla piattaforma, collegheremo il tuo account Telegram a TeaStreamCreese.\n\n` +
		`Premi il tasto qui sotto e apri l'opzione <b>Avvisi</b> per completare la configurazione.`,
	authSuccess:
		'🎉 Autorizzazione avvenuta con successo! Il tuo account Telegram è stato collegato.\n\n',
	invalidToken: '❌ Token non valido o scaduto',
	userNotFound: '❌ ID utente non trovato',
	idNotFound: '❌ Utente non collegato',
	profile: (user: User, followersCount: number) =>
		`<b>👤 Profilo dell'utente:</b>\n\n` +
		`👤 Nome: <b>${user.username}</b>\n` +
		`📧 Email: <b>${user.email}</b>\n` +
		`👥 Numero di follower: <b>${followersCount}</b>\n` +
		`✍️ Descrizione: <b>${user.bio || 'Non specificato'}</b>\n\n` +
		`🔧 Premi il pulsante qui sotto per aprire le impostazioni del profilo.`,
	follows: (user: User) =>
		`📺 <a href="http://localhost:3000/${user.username}">${user.username}</a>`,
	followChannels: (followings: string) =>
		`<b>✨ Canali a cui sei iscritto:</b>\n\n${followings}`,
	notHaveFollows: `<b>❌ Non sei iscritto a nessun canale</b>`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>🔒 Reimpostazione della password</b>\n\n` +
		`Hai richiesto la reimpostazione della password del tuo account sulla piattaforma <b>TeaStreamCreese</b>.\n\n` +
		`Per creare una nuova password, clicca sul seguente link:\n\n` +
		`<b><a href="http://localhost:3000/account/recovery/${token}">Reimposta password</a></b>\n\n` +
		`📅 <b>Data della richiesta:</b> ${new Date().toLocaleDateString()} alle ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Informazioni sulla richiesta:</b>\n\n` +
		`🌍 <b>Posizione:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`📱 <b>Sistema operativo:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`💻 <b>Indirizzo IP:</b> ${metadata.ip}\n\n` +
		`Se non hai richiesto questa operazione, puoi semplicemente ignorare questo messaggio.\n\n` +
		`Grazie per utilizzare <b>TeaStreamCreese</b>! 🚀`,
	deactivate: (token: string, metadata: SessionMetadata) =>
		`<b>⚠️ Richiesta di disattivazione dell'account</b>\n\n` +
		`Hai avviato il processo di disattivazione del tuo account sulla piattaforma <b>TeaStreamCreese</b>.\n\n` +
		`Per completare l'operazione, inserisci il seguente codice di conferma:\n\n` +
		`<b>Codice di conferma: ${token}</b>\n\n` +
		`📅 <b>Data della richiesta:</b> ${new Date().toLocaleDateString()} alle ${new Date().toLocaleTimeString()}\n\n` +
		`🖥️ <b>Informazioni sulla richiesta:</b>\n\n` +
		`🌍 <b>Posizione:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`📱 <b>Sistema operativo:</b> ${metadata.device.os}\n` +
		`🌐 <b>Browser:</b> ${metadata.device.browser}\n` +
		`💻 <b>Indirizzo IP:</b> ${metadata.ip}\n\n` +
		`<b>Cosa succede dopo la disattivazione?</b>\n\n` +
		`1. Verrai automaticamente disconnesso e perderai l'accesso al tuo account.\n` +
		`2. Se non annulli la disattivazione entro 7 giorni, il tuo account verrà <b>definitivamente eliminato</b> e tutti i dati saranno persi senza possibilità di recupero.\n\n` +
		`Se hai cambiato idea, ignora semplicemente questo messaggio. Il tuo account rimarrà attivo.\n\n` +
		`Grazie per utilizzare <b>TeaStreamCreese</b>! Siamo felici di averti sulla nostra piattaforma e speriamo che rimarrai con noi. 🚀\n\n` +
		`Il team di TeaStreamCreese`,
	accountDeleted:
		`<b>⚠️ Il tuo account è stato eliminato definitivamente</b>\n\n` +
		`Il tuo account è stato completamente rimosso dal database di TeaStreamCreese.` +
		` Tutti i tuoi dati e le informazioni sono stati eliminati senza possibilità di recupero. ❌\n\n` +
		`🔒 Non riceverai più notifiche via email o Telegram.\n\n` +
		`Per tornare sulla piattaforma in futuro, potrai registrarti cliccando sul seguente link:\n` +
		`<b><a href="http://localhost:3000/account/create">Registrati su TeaStreamCreese</a></b>\n\n` +
		`Grazie per essere stato con noi! Saremo sempre felici di rivederti sulla piattaforma. 🚀\n\n` +
		`Cordiali saluti,\n` +
		`Il team di TeaStreamCreese`,
	streamStart: (channel: User) =>
		`<b>📡 È iniziata una diretta sul canale ${channel.displayName}!</b>\n\n` +
		`Puoi guardarla qui: <a href="http://localhost:3000/${channel.username}">Segui la diretta</a>`,

	newFollowing: (follower: User, followersCount: number) =>
		`<b>🎉 Hai un nuovo follower!</b>\n\n` +
		`Follower: <a href="http://localhost:3000/${follower.username}">${follower.displayName}</a>\n\n` +
		`👥 Numero totale di follower sul canale: <b>${followersCount}</b>`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>🎉 Hai una nuova sponsorizzazione!</b>\n\n` +
		`Avete ricevuto una nuova sponsorizzazione per il piano <b>${plan.title}</b>.\n` +
		`💰 Costo: <b>${plan.price} €</b>\n` +
		`👤 Benefattore: <a href="http://localhost:3000/${sponsor.username}">${sponsor.displayName}</a>\n` +
		`📅 Data di registrazione: <b>${new Date().toLocaleDateString()} alle ${new Date().toLocaleTimeString()}</b>\n\n` +
		`Ti ringraziamo per il tuo lavoro e per il supporto alla piattaforma TeaStreamCreese!`,
	enableTwoFactor:
		`🔒 Aumenta la tua sicurezza!\n\n` +
		`Attiva l'autenticazione a due fattori nelle <a href="http://localhost:3000/dashboard/settings">impostazioni dell'account</a>`,

	verifyChannel:
		`<b>🎉 Congratulazioni! Il tuo account è stato verificato</b>\n\n` +
		`Siamo felici di annunciare che il tuo canale adesso è verificato e hai ricevuto gettone ufficiale.\n\n` +
		`Gettone di verifica certifica l'autenticità del tuo canale e migliora la fiducia degli spettatori.\n\n` +
		`Grazie per essere con noi e continua a far crescere il tuo canale con noi su TeStreamCreese!`,
};
