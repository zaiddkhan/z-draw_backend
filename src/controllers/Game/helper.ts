

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

function shortenHiddenIndices(indexes : Array<number>,count : number) : Array<number>{
    for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]; // Swap elements
    }
    return indexes.slice(0, count);

}

function findSimilarity(a: string, b: string): number {
    const matrix: number[][] = [];

    // Initialize the matrix with default values
    for (let i = 0; i <= a.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    // Populate the matrix using dynamic programming approach
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = (a[i - 1] === b[j - 1]) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,         // Deletion
                matrix[i][j - 1] + 1,         // Insertion
                matrix[i - 1][j - 1] + cost  // Substitution
            );
        }
    }

    // Calculate similarity percentage
    const maxLen = Math.max(a.length, b.length);
    const similarity = (maxLen - matrix[a.length][b.length]) / maxLen;
    
    // Convert similarity to percentage
    const similarityPercentage = similarity * 100;
    
    return similarityPercentage;
}




export {
    findSimilarity,
    generateRandomWord,
    shortenHiddenIndices
}

