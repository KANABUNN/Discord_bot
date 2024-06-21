const Token = process.env.DCTOKEN
const {
	Client,
	GatewayIntentBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	PermissionBitField,
	ActivityType
	} = require('discord.js');
const { Server, Bot } = require('./config.json');
const client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages
    ]
});
const BUTTON_ID_PREFIX = "role_"
const BUTTON_ID_1 = BUTTON_ID_PREFIX + "give.member"
const BUTTON_ID_2 = BUTTON_ID_PREFIX + "still.guest"
const BUTTON_ID_3 = BUTTON_ID_PREFIX + "kick"
const BUTTON_ID_4 = BUTTON_ID_PREFIX + "give.guest"
let inMember

client.once('ready', () => {
	client.user.setPresence({
		activities:[{
			name: "Destiny 2",
			type: ActivityType.Playing,
		}],
		status: "online",
	});
    console.log(`起動しました。`);
});

client.on('messageCreate', async message => {
	return;
	console.log(message);
	if (message.author.bot) return;
	if (!message.content.startsWith('!')) return;
	if (message.includes('gr', 1)) {
		let member = message.substring(4);
		let Member = guild.members.fetch({query:member});
		Member.roles.add(Server.Role_ID);
		client.channels.cache.get(Server.AdminCh_ID)
			.send(member + 'に追加権限を与えました。');
	}
});


client.on('guildMemberAdd' , async member => {
	console.log(`${member.guild.name} に ${member.displayName} が参加しました。`);
	ButtonCreate(Server.AdminCh_ID, Server.Role_ID)
	inMember = member
});

async function welmsg(member){
	client.channels.cache
		.get(Server.TxCh_ID)
		.send(`@everyone\n${member.guild.name}に**__${member.displayName}__**さんが参加されました！\n皆さん仲良くしてくださいね～`);
};

async function ButtonCreate(ChannelID, RoleID){
	const channel = await client.channels.fetch(ChannelID)
	channel.send({
		content: `@everyone\nサーバーに${inMember.displayName}さんがいらっしゃいました`,
		components: [
			new ActionRowBuilder()
				.setComponents([
					new ButtonBuilder()
						.setCustomId(BUTTON_ID_1)
						.setStyle(ButtonStyle.Secondary)
						.setLabel("メンバー権限を与える"),
					new ButtonBuilder()
						.setCustomId(BUTTON_ID_2)
						.setStyle(ButtonStyle.Secondary)
						.setLabel("ゲストのまま"),
					new ButtonBuilder()
						.setCustomId(BUTTON_ID_4)
						.setStyle(ButtonStyle.Secondary)
						.setLabel("botの権限を与える"),
					new ButtonBuilder()
						.setCustomId(BUTTON_ID_3)
						.setStyle(ButtonStyle.Danger)
						.setLabel("キックする"),
				]),
		],
	})
}

client.on("interactionCreate", async interaction => {
	if (!interaction.isButton()) return
	if (!interaction.customId.startsWith(BUTTON_ID_PREFIX)) return
	try {
	if (interaction.customId === BUTTON_ID_1) {
		await inMember.roles.add(Server.Role_ID)
		interaction.reply({content: `${interaction.user}が${inMember.displayName}さんに権限を付与しました。`})
		return welmsg(inMember)
		} else if (interaction.customId === BUTTON_ID_2) {
		 interaction.reply({content: `特に操作は実行されませんでした。`})
		return inMember.roles.remove(Server.Role_ID)
		} else if (interaction.customId === BUTTON_ID_3) {
		return inMember.kick()
		} else if (interaction.customId === BUTTON_ID_4) {
		return inMember.roles.add(Server.Role_ID2)
		}
	} catch {
		console.log(error);
	}
})

client.on('guildMemberRemove', rmember => {
	let Dates = new Date()
	console.log(Dates + ` 頃に${rmember.displayName} が ${rmember.guild.name} から脱退しました。`)
})

// DiscordにBotをログインさせる
client.login(Token);