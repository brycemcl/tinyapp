const generateRandomString = (stringLength = 6)=>{
  let stringToReturn = "";
  for (let index = 0; index < stringLength; index++) {
    stringToReturn += characters.randomCharacter;
  }
  return stringToReturn;
};

const characters = {
  uppercase: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  lowercase: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  get validCharacters() {
    return [...this.uppercase, ...this.lowercase, ...this.lowercase];
  },
  get randomCharacter() {
    return this.validCharacters[
      Math.floor(Math.random() * this.validCharacters.length)
    ];
  },
};
const uniqueURL = generateRandomString;
module.exports = { uniqueURL };
