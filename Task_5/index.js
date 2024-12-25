const EventEmitter = require("events");

class MessageSystem extends EventEmitter {
	sendMessage(sender, message) {
		this.emit("message", { sender, message });
	}
}

class User {
	constructor(name, system) {
		this.name = name;
		this.system = system;

		this.system.on("message", ({ sender, message }) => {
			if (sender !== this.name) {
				this.receiveMessage(sender, message);
			}
		});
	}

	sendMessage(message) {
		console.log(`${this.name} надсилає повідомлення: "${message}"`);
		this.system.sendMessage(this.name, message);
	}

	receiveMessage(sender, message) {
		console.log(`${this.name} отримав повідомлення від ${sender}: "${message}"`);
	}
}

const messageSystem = new MessageSystem();

const Sasha = new User("Sasha", messageSystem);
const Artem = new User("Artem", messageSystem);
const Valentyn = new User("Valentyn", messageSystem);

Artem.sendMessage("Привіт, меничі, хочете в шось пограти?");
Sasha.sendMessage("Йоу, ні, я зайнятий, готуюся до свят.");
Valentyn.sendMessage("Готуєшся до свят у доті?");
Sasha.sendMessage("Та я на одну катку зайшов.");
