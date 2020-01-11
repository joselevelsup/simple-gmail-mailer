require("dotenv").config();
const mailerOutlook = require("nodejs-nodemailer-outlook");
const csvToJson = require("csvtojson");
const choice = process.argv[2];

const user = process.env.MAILUSER;
const pass = process.env.MAILPASS;

async function sendMail(file, email){
	console.log(file);
	console.log(email);
	if(file){
		console.log("using list");
		const data = await csvToJson().fromFile(file);

		if(data.length >= 1){
			data.forEach(d => {
				mailerOutlook.sendEmail({
					auth: {
						user,
						pass
					},
					from: user,
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
		mailerOutlook.sendEmail({
			auth: {
				user,
				pass
			},
			from: user,
			to: email,
			subject: "Hello friend",
			html: "Hello there",
			onError: (e) => {
				console.log(e);
			},
			onSuccess: () => {
				console.log("success");
			}
		});
	}
}

if(choice == "list"){
	sendMail(process.argv[3], null);
} else if(choice == "single") {
	sendMail(null, process.argv[3]);
} else {
	console.log("unknown choice");
}


