/** general **/
var fs = require('fs');
const Twitter = require('twit');
const Discord = require('discord.js');


function writeToFile(path,data){
	fs.writeFile(path,JSON.stringify(data),err=>{
		if(err) throw err;
	});
}


/** DISCORD **/
const MY_ID = "YOUR_DISCORD_USER_ID";
const client = new Discord.Client();
var channels_data = [];
var client_config = {
	token: 'BOT_TOKEN',
	channels: require('./channels.json'),
	ids:require('./ids.json')
};



//Creates the data in JSON format
function createRequiredData(channel_id){
	let formated = {
		'channel':channel_id,
		'ids':[]
	}
	return formated;
}

function addIfNotExists(channel){
	for(var i=0;i<client_config.channels.length;i++){
		if(client_config.channels[i]['channel'] === channel){
			return
		}
	}
	var data = createRequiredData(channel);
	client_config.channels.push(data);	
}

//returns the channel if exists
function desiredChannel(id){
	let channels = [];
	let channels_id = [];
	for(let i=0;i<client_config.channels.length;i++){
		if(client_config.channels[i].ids.indexOf(id) > -1){
			channels_id.push(client_config.channels[i].channel)
		}
	}
	for(let j=0;j<channels_id.length;j++){
		for(var i=0;i<channels_data.length;i++){
			if(channels_id[j] === channels_data[i]['id']){
				channels.push(channels_data[i]);
			}
		}	
	}

	return channels;
}

function addToChannel(id,value){
	for(var i=0;i<client_config.channels.length;i++){
		if(client_config.channels[i]['channel'] === id){
			client_config.channels[i]['ids'].push(value);
			return;
		}
	}
}


/** END DISCORD **/

/** TWITTER **/

const twitter_data = {
	consumer_key: 'CONSUMER_KEY',
	consumer_secret: 'CONSUMER_SECRET',
	access_token: 'ACCESS_TOKEN',
	access_token_secret: 'ACCESS_TOKEN_SECRET',
}

var T = new Twitter(twitter_data);
stream = T.stream('statuses/filter',{follow:client_config.ids});
stream.on('connected',response=>{
	console.log("im connected dewd!");
	//Run discord bot only when the stream is connected
	client.login(client_config.token);
});

configureStream(stream);

/** END TWITTER **/

client.on('ready', ()=>{
	console.log("Logged in as Harpy");
	client.user.setGame("Twitter");
	channels_data = client.channels.array();
});

client.on('message',msg=>{
	if(msg.content === '¬set' && msg.author.id === MY_ID){
		addIfNotExists(msg.channel.id)
		writeToFile('./channels.json',client_config.channels);
	}
	else if(msg.content.startsWith('¬add') && client_config.channels.length > 0){
		let name = msg.content.split('/').pop();
		T.get('users/show/'+name,function(err,data,response){
			if(err){
				console.log(err);
				return;
			}
			msg.channel.send("Done");
			client_config.ids.push(data.id);
			addToChannel(msg.channel.id,data.id);
			writeToFile('./channels.json',client_config.channels);
			writeToFile('./ids.json',client_config.ids);
			if(client_config.ids.length > 1){
				stream.reqOpts.url += data.id;
			}
			else{
				stream.reqOpts.url += "%2C" + data.id;
			}
			
		});
	}
});

function configureStream(stream) {
	stream.on('tweet',tweet=>{
		if('media' in tweet.entities){
			for(let j=0;j<tweet.entities.media.length;j++){
				let url = tweet.entities.media[j].media_url;
				//console.log("url = " + url);
				let id = tweet.user.id;
				//console.log("id = " + id);
				let ch = desiredChannel(id);
				//console.log(ch)
				let name = tweet.user.name;
				//console.log("name = " + name);
				for(let i=0;i<ch.length;i++){
					//console.log(ch[i]);
					ch[i].send("**<"+name+">**\n"+url);
				}
			}

		}
	});
}
