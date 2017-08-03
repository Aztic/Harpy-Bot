# Twitter-Images-Bot
A discord bot that post all images of desired twitter user in desired Discord channels

## Requirements
- [discord.js](https://discord.js.org)
- [twit](https://github.com/ttezel/twit)
## Install
```
git clone https://github.com/Aztic/Twitter-Images-Bot/ && cd Twitter-Images-Bot
npm install
```
## Discord usage
- Add the bot to your desired server/guild
- once she's added to server(yes, she's "harpy" <3), use `¬set` in your desired channel
- Then, use `¬add https://twitter.com/Your_Desired_user` to add the user

You can have many channels and many users in same/different channels. The data is stored in two files: `ids.json` and `channels.json`

## Data info
- ids.json: This is just an array of all users, it doesnt matter the channel.
- channels.json
 An array of dictionary, every position of the array have this structure 
```javascript
{channel:'channel_id',ids:[all,the,users,of,this,channel]}
```

## TODO
- Fix the twitter stream connection (sometimes it connects, sometimes wont)

## License
Apache 2.0
