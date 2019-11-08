require("dotenv").config();
const nodemailer = require("nodemailer");
const csvToJson = require("csvtojson");
const choice = process.argv[2];

const mailer = nodemailer.createTransport({
	service: "gmail",
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, 
	auth: {
		type: "OAuth2",
		user: process.env.MAILUSER,
		clientId: process.env.MAILER_CLIENT_ID, //Client ID from Google API Console
		clientSecret: process.env.MAILER_SECRET_TOKEN, // Client Secret from Google API Console
		refreshToken: process.env.MAILER_REFRESH_TOKEN // Refresh Token from https://developers.google.com/oauthplayground/
	}
});

async function sendMail(file, email){
	console.log(file);
	console.log(email);
	if(file){
		console.log("using list");
		const data = await csvToJson().fromFile(file);

		if(data.length >= 1){
			data.forEach(d => {
				mailer.sendMail({
					from: process.env.MAILUSER,
					to: d.Email || d.email,
					subject: "Hello Friend",
					html: "Hello friend. Here is mail"
				}, (err, info) => {
					if(err){
						console.log(err);
					} else {
						console.log("sent");
						console.log(info);
					}
				});
			});
		}
	}

	if(email){
		mailer.sendMail({
			from: process.env.MAILUSER,
			to: email,
			subject: "Hello friend",
			html: "Hello there"
		}, (err, info) => {
			if(err){
				console.log(err);
			} else {
				console.log("sent");
				console.log(info);
			}
		})
	}
}

if(choice == "list"){
	sendMail(process.argv[3], null);
} else if(choice == "single") {
	sendMail(null, process.argv[3])
} else {
	console.log("unknown choice");
}


