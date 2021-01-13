require('dotenv').config();

const fs = require('fs');

const { Client } = require('discord.js');
const client = new Client();

const PREFIX = "!";

const dataDir = './data/';

client.on('ready', () => 
{
    console.log(`${client.user.username} has succesfully logged in`);

    CreateDirectory();
});

client.on('message', (message) => 
{
    if(message.author.bot) return;

    if(message.channel.type == "dm") return;

    if(message.content.startsWith(PREFIX))
    {
        const [cmd, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);

        console.log(cmd);
        console.log(args[0]);
        if(cmd == "c-badge")
        {
            if(message.member.permissions.has("MANAGE_EMOJIS"))
            {
                CreateBadge(args[0], message.channel.guild.id, message.channel);
            }
        }
        else if(cmd == "g-badge")
        {
            if(message.member.permissions.has("MANAGE_EMOJIS"))
            {
                GiveBadge(args[0], args[1], message.channel.guild.id, message.channel);
            }
        }
    }
});

client.login(process.env.BADGER_BOT_TOKEN);

function CreateBadge(badgeName, guildID, channel)
{
    CreateOtherDirectory(guildID);

    badgeDir = dataDir + guildID + "/Badges";

    var data = badgeData;

    data.badgeName = badgeName;

    let json = JSON.stringify(data, null, 2);

    fs.readdir(badgeDir, (err, files) => 
    {
        var id = files.length + 1;
        fs.writeFileSync(badgeDir + "/" + id + ".json", json);
        channel.send(`Added the Badge ${badgeName} as **${id}**`);
    });
}

function GiveBadge(badgeID, userID, guildID, channel)
{
    CreateOtherDirectory(guildID);
    CreateUserFile(userID, guildID);

    userDir = dataDir + guildID + "/Users/" + userID + ".json"; 

    var data = JSON.parse(fs.readFileSync(userDir));

    if(GetBadgeName(badgeID, guildID) != false)
    {
        if(data.badgeID.includes(badgeID))
        {
            var index = data.badgeID.findIndex(badge => badge === badgeID);
            data.badgeCount[index] += 1;
    
            let json = JSON.stringify(data, null, 2);
            fs.writeFileSync(userDir, json);
            channel.send(`The user was awarded the Badge **${GetBadgeName(badgeID, guildID)}** again`);
        }
        else
        {
            data.badgeID.push(badgeID);
            data.badgeCount.push(1);
    
            let json = JSON.stringify(data, null, 2);
            fs.writeFileSync(userDir, json);
            channel.send(`The user was awarded the Badge **${GetBadgeName(badgeID, guildID)}**`);
        }
    }else
    {
        channel.send("No Badge with that ID");
    }

}

function GetBadgeName(badgeID, guildID)
{
    badgeDir = dataDir + guildID + "/Badges/" + badgeID + ".json";

    console.log(badgeDir);
    if(fs.existsSync(badgeDir))
    {
        console.log("Yes");
        var data = JSON.parse(fs.readFileSync(badgeDir));

        var name = data.badgeName;
    
        return name;
    }
    else
    {
        return false;
    }

}

function CreateDirectory()
{
    var dir = "./data";
    if(!fs.existsSync(dir))
    {
        console.log('Data Directory not found! Creating new Directory! [Data]');
        fs.mkdirSync(dir);
    }
}

function CreateOtherDirectory(guildID)
{
    var guildDir = dataDir + guildID;
    if(!fs.existsSync(guildDir))
    {
        console.log(guildID + " Directory not found! Creating new Directory! [Guild]");
        fs.mkdirSync(guildDir);
    }


    var badgeDir = dataDir + guildID + "/Badges";
    if(!fs.existsSync(badgeDir))
    {
        console.log("Badge Directory not found! Creating new Directory! [Badge]");
        fs.mkdirSync(badgeDir);
    }

    var userDir = dataDir + guildID + "/Users";
    if(!fs.existsSync(userDir))
    {
        console.log("User Directory not found! Creating new Directory! [User]");
        fs.mkdirSync(userDir);
    }
}

function CreateUserFile(userID, guildID)
{
    if(!fs.existsSync(dataDir + guildID + "/Users/" + userID + ".json")){

        let data = JSON.stringify(userData, null , 2);
        fs.writeFileSync(dataDir + guildID + "/Users/" + userID + ".json", data);
    }
}

const badgeData = 
{
    badgeName: ""
};

const userData = 
{
    badgeID: [],
    badgeCount: []
}