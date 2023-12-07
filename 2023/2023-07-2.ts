import { getInput } from "./utils";

const input = getInput(__filename, false);

enum HandType {
  HIGH_CARD = 0,
  ONE_PAIR = 1,
  TWO_PAIR = 2,
  THREE_OF_A_KIND = 3,
  FULL_HOUSE = 4,
  FOUR_OF_A_KIND = 5,
  FIVE_OF_A_KIND = 6,
}
interface Hand {
  bid: number;
  cards: string[];
  handType?: HandType;
  arr?: any;
  handTypeString?: string;
}

const handTypeStrings = [
  "HIGH_CARD",
  "ONE_PAIR",
  "TWO_PAIR",
  "THREE_OF_A_KIND",
  "FULL_HOUSE",
  "FOUR_OF_A_KIND",
  "FIVE_OF_A_KIND",
];

const getCountsByCard = (cards: string[]): { [card: string]: number } => {
  return cards.reduce((acc, card) => {
    acc[card] = (acc[card] ?? 0) + 1;
    return acc;
  }, {});
};

const getCountTuples = (countsByCard: {
  [card: string]: number;
}): [string, number][] => {
  return Object.keys(countsByCard)
    .map((k) => {
      return [k, countsByCard[k]];
    })
    .sort((a: any, b: any) => {
      return b[1] - a[1];
    });
};

const getHandType = (hand: Hand): HandType => {
  const countsByCard = getCountsByCard(hand.cards);
  const arr = getCountTuples(countsByCard);

  if (arr.length === 5) {
    return HandType.HIGH_CARD;
  }

  if (arr.length === 1) {
    return HandType.FIVE_OF_A_KIND;
  }

  if (arr[0][1] === 4) {
    return HandType.FOUR_OF_A_KIND;
  }

  if (arr[0][1] === 3 && arr[1][1] === 2) {
    return HandType.FULL_HOUSE;
  }

  if (arr[0][1] === 3) {
    return HandType.THREE_OF_A_KIND;
  }

  if (arr[0][1] === 2 && arr[1][1] === 2) {
    return HandType.TWO_PAIR;
  }

  if (arr[0][1] === 2) {
    return HandType.ONE_PAIR;
  }

  //   if (arr.length === 4) {
  //     if (arr[0][1] === 2) {
  //       return HandType.ONE_PAIR;
  //     }
  //   }

  //   if (arr.length === ) {
  //   }
  //   if (arr.length == 2 && arr[0][0] === 3 && arr[0][1] === 2) {
  //     return HandType.FULL_HOUSE;
  //   }

  //   //   if (arr.length === 4) {
  //   //     return HandType.ONE_PAIR;
  //   //   }

  //   //   console.log(countsByCard);
  //   console.log(arr);
  //   console.log(arr);
  throw Error("Could not figure out hand type");
};

const hands: Hand[] = input
  .split("\n")
  .filter((line) => !!line)
  .map((line) => {
    const [cardString, bidString] = line.split(" ");
    const cards = cardString.split("");
    const bid = parseInt(bidString);
    const cardsAndBid = { bid, cards };
    const handType = getHandType(cardsAndBid);

    const countsByCard = getCountsByCard(cards);
    const arr = getCountTuples(countsByCard);

    // const rank = handType + 1;
    // const winnings = rank * bid;
    // sum += winnings;

    const hand: Hand = {
      ...cardsAndBid,
      handType,
      handTypeString: handTypeStrings[handType],
      arr,
      //   rank,
      //   winnings,
    };
    return hand;
  });

const rankings: { [k in HandType]: Hand[] } = {
  [HandType.HIGH_CARD]: [],
  [HandType.ONE_PAIR]: [],
  [HandType.TWO_PAIR]: [],
  [HandType.THREE_OF_A_KIND]: [],
  [HandType.FULL_HOUSE]: [],
  [HandType.FOUR_OF_A_KIND]: [],
  [HandType.FIVE_OF_A_KIND]: [],
};

// console.log(rankings);

const getCardValue = (card: string): number => {
  if (card === "A") return 1000000;
  if (card === "K") return 100009;
  if (card === "Q") return 100008;
  if (card === "K") return 100007;
  if (card === "J") return 100006;
  if (card === "T") return 100005;
  return card.charCodeAt(0);
};

for (let i = 0; i < hands.length; i++) {
  const hand = hands[i];
  const firstCard = hand.cards[0];

  let arr = rankings[hand.handType as HandType];
  arr.push(hand);
  if (arr.length === 1) {
    rankings[hand.handType as HandType] = arr;
    continue;
  }

  arr.sort((a, b) => {
    let diff = 0;
    let i = 0;
    while (diff === 0) {
      const aCard = a.cards[i];
      const bCard = b.cards[i];
      const aCardVal = getCardValue(a.cards[i]);
      const bCardVal = getCardValue(b.cards[i]);
      diff = getCardValue(a.cards[i]) - getCardValue(b.cards[i]);
      //   console.log("comparing", i, aCard, aCardVal, bCard, bCardVal, diff);
      i++;
    }

    return diff;
  });

  rankings[hand.handType as HandType] = arr;
}

const flatRankings = Object.values(rankings).reduce((acc, r) => {
  return [...acc, ...r];
}, []);

const sum = flatRankings.reduce((acc, r, idx) => {
  const rank = idx + 1;
  //   console.log(rank, r.bid, r.cards, r.handTypeString);
  return acc + r.bid * rank;
}, 0);

console.log(sum);
