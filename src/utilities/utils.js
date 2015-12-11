var colorsData = [];
var animalsData = [];

var getClientListasString = function(clientList){
	var list = ""
	for(var j = 0; j < clientList.length; j++){
		list += clientList[j].username + " , ";
	}
	return list;

}
//deprecated
var getTimestamp = function(){
	var d = new Date();
	var fullTime = "";
	var am_pm = "";
	var hours = d.getUTCHours();
	if(hours >= 12){
		am_pm = "PM";
		var h = (hours % 12);
		fullTime += h
	}
	else{
		am_pm = "AM";
		fullTime += hours;
	}
	var mins = d.getUTCMinutes();
	if(mins < 10){
		fullTime += ":0" +mins + " " + am_pm;
	}
	else{
		fullTime += ":" +mins + " " + am_pm;
	}


	return fullTime.toString();

}
var getDatestamp = function(){
	var d = new Date();
	var fullDate ="";
	fullDate += d.getDate() + "/";
	fullDate += (d.getMonth() +1) + "/";
	fullDate += d.getFullYear();

	return fullDate;
}

var getRandomName = function(){
	var name = "";
	name += colorsData[Math.floor((Math.random() * colorsData.length))] + " ";
	name += animalsData[Math.floor((Math.random() * animalsData.length))];
	return name;
}

var SendServerMessage = function(socket,msg){
  socket.emit("message", {roomName:"SERVER",message:msg, username:"Server Message", color:"EE0000"})
}

var sendServerToast = function(socket, msg){
	socket.emit("messageToast", {message:msg});
}

var updateSocketObject = function(socket, clients){
	var index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
      clients.push(socket);
    }
}

var getRandomColor = function(){
	var c = "0123456789ABCDEF";
	var colorList = c.split("");
	var color = "";
	for(var i =0; i < 6; i++){
		var num = Math.floor((Math.random() * 16));
		color += colorList[num];
	}
	return color;
}

	var colorsData = [
		"evil",
		"austere",
		"killer",
		"great",
		"old",
		"nice",
		"funny",
		"sick",
		"wicked",
		"nasty",
		"cool",
		"broken",
		"new",
		"crappy",
		"super",
		"lovely",
		"ancient",
		"pretty",
		"warm",
		"deadly",
		"dangerous",
		"drunken",
		"stoned",
		"severe",
		"awesome",
		"creative",
		"poisonous",
		"smashing",
		"simple",
		"complex",
		"killer",
		"murderous",
		"humane",
		"professor",
		"teacher",
		"swami",
		"corrosive",
		"monsterous",
		"big",
		"small",
		"little",
		"huge",
		"gigantic",
		"tiny",
		"happy",
		"sad",
		"frankie the",
		"funky",
		"spunky",
		"cuddly",
		"salty",
		"magenta",
		"vivid",
		"vague",
		"trainer",
		"jimmy the",
		"innocuous",
		"agent",
		"amazing",
		"mister",
		"miss"

	];
	var animalsData = [
	  "aardvark",
	  "albatross",
	  "alligator",
	  "alpaca",
	  "ant",
	  "anteater",
	  "antelope",
	  "ape",
	  "armadillo",
	  "donkey",
	  "baboon",
	  "badger",
	  "barracuda",
	  "bat",
	  "bear",
	  "beaver",
	  "bee",
	  "bison",
	  "boar",
	  "buffalo",
	  "butterfly",
	  "camel",
	  "capybara",
	  "caribou",
	  "cassowary",
	  "cat",
	  "caterpillar",
	  "cattle",
	  "chamois",
	  "cheetah",
	  "chicken",
	  "chimpanzee",
	  "chinchilla",
	  "chough",
	  "clam",
	  "cobra",
	  "cockroach",
	  "cod",
	  "cormorant",
	  "coyote",
	  "crab",
	  "crane",
	  "crocodile",
	  "crow",
	  "curlew",
	  "deer",
	  "dinosaur",
	  "dog",
	  "dogfish",
	  "dolphin",
	  "donkey",
	  "dotterel",
	  "dove",
	  "dragonfly",
	  "duck",
	  "dugong",
	  "dunlin",
	  "eagle",
	  "echidna",
	  "eel",
	  "eland",
	  "elephant",
	  "elk",
	  "emu",
	  "falcon",
	  "ferret",
	  "finch",
	  "fish",
	  "flamingo",
	  "fly",
	  "fox",
	  "frog",
	  "gaur",
	  "gazelle",
	  "gerbil",
	  "giraffe",
	  "gnat",
	  "gnu",
	  "goat",
	  "goose",
	  "goldfinch",
	  "goldfish",
	  "gorilla",
	  "goshawk",
	  "grouse",
	  "guanaco",
	  "gull",
	  "hamster",
	  "hare",
	  "hawk",
	  "hedgehog",
	  "heron",
	  "herring",
	  "hornet",
	  "horse",
	  "human",
	  "hyena",
	  "ibex",
	  "ibis",
	  "jackal",
	  "jaguar",
	  "jay",
	  "jellyfish",
	  "kangaroo",
	  "kingfisher",
	  "koala",
	  "kookabura",
	  "kouprey",
	  "kudu",
	  "lapwing",
	  "lark",
	  "lemur",
	  "leopard",
	  "lion",
	  "llama",
	  "lobster",
	  "locust",
	  "loris",
	  "louse",
	  "lyrebird",
	  "magpie",
	  "mallard",
	  "manatee",
	  "mandrill",
	  "mantis",
	  "marten",
	  "meerkat",
	  "mink",
	  "mole",
	  "mongoose",
	  "monkey",
	  "moose",
	  "mouse",
	  "mosquito",
	  "mule",
	  "narwhal",
	  "newt",
	  "octopus",
	  "okapi",
	  "opossum",
	  "oryx",
	  "ostrich",
	  "otter",
	  "owl",
	  "ox",
	  "oyster",
	  "panther",
	  "parrot",
	  "partridge",
	  "peafowl",
	  "pelican",
	  "penguin",
	  "pheasant",
	  "pig",
	  "pigeon",
	  "polar-bear",
	  "pony",
	  "porcupine",
	  "porpoise",
	  "quail",
	  "quelea",
	  "quetzal",
	  "rabbit",
	  "raccoon",
	  "rail",
	  "ram",
	  "rat",
	  "raven",
	  "red-deer",
	  "red-panda",
	  "reindeer",
	  "rhinoceros",
	  "rook",
	  "salamander",
	  "salmon",
	  "sand-dollar",
	  "sandpiper",
	  "sardine",
	  "scorpion",
	  "sea-lion",
	  "sea-urchin",
	  "seahorse",
	  "seal",
	  "shark",
	  "sheep",
	  "shrew",
	  "skunk",
	  "snail",
	  "snake",
	  "sparrow",
	  "spider",
	  "spoonbill",
	  "squid",
	  "squirrel",
	  "starling",
	  "stingray",
	  "stinkbug",
	  "stork",
	  "swallow",
	  "swan",
	  "tapir",
	  "tarsier",
	  "termite",
	  "tiger",
	  "toad",
	  "trout",
	  "turkey",
	  "turtle",
	  "vicuna",
	  "viper",
	  "vulture",
	  "wallaby",
	  "walrus",
	  "wasp",
	  "weasel",
	  "whale",
	  "wolf",
	  "wolverine",
	  "wombat",
	  "woodcock",
	  "woodpecker",
	  "worm",
	  "wren",
	  "yak",
	  "zebra"
	];



module.exports.getClientListasString = getClientListasString;
module.exports.getTimestamp = getTimestamp;
module.exports.getDatestamp = getDatestamp;
module.exports.getRandomColor = getRandomColor;
module.exports.getRandomName = getRandomName;
module.exports.sendServerMessage = SendServerMessage;
module.exports.sendServerToast = sendServerToast;
module.exports.updateSocketObject = updateSocketObject;
