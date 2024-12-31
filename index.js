const Token = process.env.DCTOKEN
const {
	Client,
	GatewayIntentBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	PermissionBitField,
	ActivityType,
	CommandInteractionOptionResolver
	} = require('discord.js');
const { Server, Bot } = require('./config.json');
const client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages
    ]
});
const Pre = "role_"
const BUTTON_ID_1 = Pre + "give.member"
const BUTTON_ID_2 = Pre + "still.guest"
const BUTTON_ID_3 = Pre + "kick"
const BUTTON_ID_4 = Pre + "give.guest"
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
	startmsg();
	});

client.on('guildMemberAdd' , async member => {
	console.log(`${member.guild.name} に ${member.displayName} が参加しました。`);
	await member.roles.add(Server.Temp_Role);
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
	await channel.send({
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
						.setLabel("ゲスト権限を与える"),
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
};

client.on("interactionCreate", async interaction => {
	if (!interaction.isButton()) return
	if (!interaction.customId.startsWith(BUTTON_ID_PREFIX)) return
	try {
		if (interaction.customId === BUTTON_ID_1) {
			await inMember.roles.add(Server.Main_Role);
			await inMember.roles.remove(Server.Temp_Role);
			interaction.reply({content: `${interaction.member.displayName}が${inMember.displayName}さんに権限を付与しました．`});
			return welmsg(inMember)
		} else if (interaction.customId === BUTTON_ID_2) {
			interaction.reply({content: `${interaction.member.displayName}が${inMember.displayName}さんにゲスト用の権限を与えました．`});
			await inMember.roles.remove(Server.Temp_Role);
			return inMember.roles.add(Server.Guest_Role)
		} else if (interaction.customId === BUTTON_ID_3) {
			interaction.reply({content: `${interaction.member.displayName}が${inMember.displayName}さんをキックしました．`})
			return inMember.kick()
		} else if (interaction.customId === BUTTON_ID_4) {
			interaction.reply({content: `${interaction.member.displayName}が${inMember.displayName}にボット用のロールを付与しました．`});
			await inMember.roles.remove(Server.Temp_Role);
			return inMember.roles.add(Server.Bot_Role)
		}
	} catch(error) {
		console.error(error)
	}
});

client.on('guildMemberRemove', async rmember => {
	let Dates = new Date()
	console.log(Dates + ` 頃に${rmember.displayName} が ${rmember.guild.name} から脱退しました。`)
});

client.login(Token);
