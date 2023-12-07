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

const getHandType = (cards: string[]): HandType => {
  const countsByCard = getCountsByCard(cards);
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

  throw Error("Could not figure out hand type");
};

const getJokerCount = (cards: string[]): number => {
  return cards.reduce((acc, c) => {
    return c === "J" ? acc + 1 : acc;
  }, 0);
};

const getJokerModifiedHandCount = (cards: string[]): HandType => {
  const handType = getHandType(cards);
  const jokerCount = getJokerCount(cards);

  const cardsWithoutJokers = cards.filter((c) => c !== "J");
  const cbcwj = getCountsByCard(cardsWithoutJokers);
  const arr = getCountTuples(cbcwj);

  // No mods needed
  if (jokerCount === 0) {
    return handType;
  }

  // Naturally...!
  if (jokerCount === 5) {
    return HandType.FIVE_OF_A_KIND;
  }

  // Four jokers + any other card is 5 of a kind
  if (jokerCount === 4) {
    return HandType.FIVE_OF_A_KIND;
  }

  if (jokerCount === 3) {
    if (arr[0][1] === 2) return HandType.FIVE_OF_A_KIND;
    if (arr[0][1] === 1) return HandType.FOUR_OF_A_KIND;

    // We skip full house because if there were two other non-J cards
    // of the same kind, it would be five of a kind since that's
    // higher than a full house.
    return HandType.THREE_OF_A_KIND;
  }

  if (jokerCount === 2) {
    if (arr[0][1] === 3) return HandType.FIVE_OF_A_KIND;
    if (arr[0][1] === 2) return HandType.FOUR_OF_A_KIND;
    if (arr[0][1] === 2 && arr[1][1] === 1) return HandType.FULL_HOUSE;
    if (arr[0][1] === 1) return HandType.THREE_OF_A_KIND;

    // We skip TWO_PAIR because if there were another non-joker pair,
    // it would be four of a kind.
    return HandType.ONE_PAIR;
  }

  if (jokerCount === 1) {
    if (arr[0][1] === 4) return HandType.FIVE_OF_A_KIND;
    if (arr[0][1] === 3) return HandType.FOUR_OF_A_KIND;
    if (arr[0][1] === 2 && arr[1][1] === 2) return HandType.FULL_HOUSE;
    if (arr[0][1] === 2) return HandType.THREE_OF_A_KIND;
    // if (arr[0][1] === 2 && arr[]) return HandType.THREE_OF_A_KIND;
    return HandType.ONE_PAIR;
    // if (arr[0][1] === 2) return HandType.THREE_OF_A_KIND;
  }

  return 0;
};

const hands: Hand[] = input
  .split("\n")
  .filter((line) => !!line)
  .map((line) => {
    const [cardString, bidString] = line.split(" ");
    const cards = cardString.split("");
    const bid = parseInt(bidString);
    const cardsAndBid = { bid, cards };
    const handType = getJokerModifiedHandCount(cards);

    // if (getJokerCount(cards) > 0) {
    //   console.log();
    //   console.log(getJokerCount(cards), cards);
    //   console.log(
    //     "hand type",
    //     handTypeStrings[getHandType(cards)],
    //     getHandType(cards)
    //   );
    //   console.log("modified hand type", handTypeStrings[handType], handType);
    //   console.log(
    //     "hand type???",
    //     getHandType(cards) + getJokerCount(cards) + 1
    //   );
    // }

    // console.log({})
    // console.log("with joker boost\t", handTypeStrings[handType]);

    // const jokerCount = cards.reduce((acc, c) => {
    //   return c === "J" ? acc + 1 : acc;
    // }, 0);
    // const cardsWithoutJokers = cards.filter((c) => c !== "J");
    // const handTypeWithoutJokers = getHandType(cardsWithoutJokers);

    // const highestHandType = Math.max(
    //   handType,
    //   handTypeWithoutJokers + jokerCount
    // );

    const countsByCard = getCountsByCard(cards);
    const arr = getCountTuples(countsByCard);

    const hand: Hand = {
      ...cardsAndBid,
      handType: handType,
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
  if (card === "J") return 1;
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
  // FIXM
  //   console.log(rank, r.bid, r.cards, r.handTypeString);
  return acc + r.bid * rank;
}, 0);

console.log(sum);
