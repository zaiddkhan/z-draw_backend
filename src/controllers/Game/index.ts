import { OutgoingMessage } from "http";

const randomWords = [
    "Apple",
    "Banana",
    "Chocolate",
    "Elephant",
    "Happiness",
    "Sunshine",
    "Guitar",
    "Mountain",
    "Universe",
    "Butterfly",
    "Library",
    "Adventure",
    "Telescope",
    "Watermelon",
    "Dragonfly",
    "Synergy",
    "Rainbow",
    "Pencil",
    "Elephantiasis",
    "Fireworks",
    "Moonlight",
    "Octopus",
    "Serendipity",
    "Chocolate",
    "Sunflower",
    "Basketball",
    "Volcano",
    "Penguin",
    "Waterfall",
    "Jellyfish",
    "Friendship",
    "Pineapple",
    "Mountainous",
    "Wonderland",
    "Lighthouse",
    "Trampoline",
    "Photography",
    "Thunderstorm",
    "Happiness",
    "Caterpillar",
    "Silhouette",
    "Snowflake",
    "Orchestra",
    "Adventure",
    "Butterfly",
    "Zucchini",
    "Parachute",
    "Whirlwind",
    "Hippopotamus",
    "Orchestra",
    "Wanderlust",
    "Meditation",
    "Playground",
    "Microscope",
    "Reflection",
    "Strawberry",
    "Pineapple",
    "Waterfall",
    "Symphony",
    "Marshmallow",
    "Seashells",
    "Exploration",
    "Helicopter",
    "Lemonade",
    "Sunshine",
    "Chocolate",
    "Harmonious",
    "Sanctuary",
    "Butterfly",
    "Dragonfly",
    "Adventure",
    "Serendipity",
    "Fireworks",
    "Telescope",
    "Watermelon",
    "Basketball",
    "Butterfly",
    "Serenity",
    "Moonlight",
    "Happiness",
    "Dragonfly",
    "Telescope",
    "Watermelon",
    "Basketball",
    "Serendipity",
    "Fireworks",
    "Elephant",
    "Chocolate",
    "Symphony",
    "Universe",
    "Adventure",
    "Serenity",
    "Waterfall",
    "Butterfly",
    "Elephant",
    "Happiness",
    "Rainbow",
    "Universe",
    "Harmony",
    "Chocolate"
];



export interface OutgoingGuessWord{
    word : string,
    length : number,
    indexes : number[]

}
function generateRandomWord()  {
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    const randomWord = randomWords[randomIndex]
    const numberOfBlanks = randomWord.length / 2;
    const blankIndexes = getRandomBlankIndexes(randomWord,numberOfBlanks)
    const outgoingGuessWord : OutgoingGuessWord = {
        word  : randomWord,
        length : randomWord.length,
        indexes : blankIndexes
    }
    return outgoingGuessWord;


}


function getRandomBlankIndexes(s : string,numberOfBlanks : number){
    const listOfIndexes = new Set<number>();
    while (listOfIndexes.size < numberOfBlanks) {
        const randomIndex = Math.floor(Math.random() * s.length);
        listOfIndexes.add(randomIndex);
    }
    return Array.from(listOfIndexes);
}

export default generateRandomWord