package main

import (
	"fmt"
	"math/big"
	"regexp"
	"strconv"
	"strings"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	input := util.ReadInput()
	monke(input, 20, true)
	// monke(input, 10000, false)
}

type MonkeyFn func(old *big.Int) *big.Int
type Monkey struct {
	id          int
	items       []*big.Int
	operation   MonkeyFn
	testDivisor *big.Int
	testTrue    int
	testFalse   int
	count       int
}

func monke(input []string, maxRounds int, shouldDivide bool) {
	// fmt.Println(math.MaxInt)
	monkeys := parseMonkeys(input)
	// for _, m := range monkeys {
	// 	fmt.Println("monkey", m.id)
	// 	fmt.Println(m.items)
	// 	fmt.Println(m.testDivisor)
	// 	fmt.Println(m.testTrue)
	// 	fmt.Println(m.testFalse)
	// 	// fmt.Println(m.operation)
	// }

	round := 1

	for {
		if round > maxRounds {
			break
		}

		fmt.Printf("\n\nRound %d\n", round)

		for _, monkey := range monkeys {
			// fmt.Printf("\tMonkey %d, %+v\n", monkey.id, monkey.items)
			for _, initialWorry := range monkey.items {
				worry := monkey.operation(initialWorry)
				monkey.count++

				if shouldDivide {
					worry = worry.Div(worry, big.NewInt(int64(3)))
				}

				test := worry.Mod(worry, monkey.testDivisor).Cmp(big.NewInt(0))

				var nextMonkey int
				switch test {
				case 0:
					nextMonkey = monkey.testTrue
				default:
					nextMonkey = monkey.testFalse
				}

				// fmt.Printf("\t\t\tItem with worry level %d is thrown to monkey %d\n", worry, nextMonkey)
				monkeys[nextMonkey].items = append(monkeys[nextMonkey].items, worry)
			}
			monkey.items = make([]*big.Int, 0)
		}

		// shouldPrint := round == 1 || round == 20 || round == 1000 || round == 2000 || round == 3000 || round == 4000 || round == 5000 || round == 6000 || round == 7000 || round == 8000 || round == 9000 || round == 10000

		for _, m := range monkeys {
			fmt.Printf("monkey %d: %+v\n", m.id, m.items)
			// fmt.Printf("monkey %d: %d\n", m.id, m.count)
		}

		// fmt.Println()
		round++
	}

	fmt.Println("\n==== RESULTS ====")

	biggest := 0
	secondBiggest := 0

	for _, m := range monkeys {
		fmt.Printf("monkey %d: %d\n", m.id, m.count)
		switch {
		case m.count > biggest:
			secondBiggest = biggest
			biggest = m.count
		case m.count > secondBiggest:
			secondBiggest = m.count
		}
	}
	fmt.Println()

	fmt.Println(biggest, secondBiggest)
	fmt.Println(biggest * secondBiggest)

	fmt.Println("done")
}

// Regexes are kind of slow, but it's good practice!
var mre = regexp.MustCompile(`^Monkey (\d+):$`)
var sre = regexp.MustCompile(`^Starting items: (?:(\d+)(?:,\s)?)+$`)
var ore = regexp.MustCompile(`^Operation: new = old ([+*]) (\w+)`)
var dre = regexp.MustCompile(`^Test: divisible by (\d+)`)
var tre = regexp.MustCompile(`^If true: throw to monkey (\d+)`)
var fre = regexp.MustCompile(`^If false: throw to monkey (\d+)`)

func parseMonkeys(input []string) []*Monkey {
	monkeyCounter := 0
	var monkeys []*Monkey

	for _, line := range input {
		trimmed := strings.TrimSpace(line)

		switch {
		case mre.MatchString(trimmed):
			mid, _ := strconv.Atoi(mre.FindAllStringSubmatch(trimmed, -1)[0][1])
			monkeyCounter = mid
			monkeys = append(monkeys, &Monkey{id: mid})
		case sre.MatchString(trimmed):
			monkeys[monkeyCounter].items = parseStartingItems(trimmed)
		case ore.MatchString(trimmed):
			monkeys[monkeyCounter].operation = parseOperation(trimmed)
		case dre.MatchString(trimmed):
			monkeys[monkeyCounter].testDivisor = parseTestDivisor(trimmed)
		case tre.MatchString(trimmed):
			monkeys[monkeyCounter].testTrue = parseTargetMonkey(trimmed)
		case fre.MatchString(trimmed):
			monkeys[monkeyCounter].testFalse = parseTargetMonkey(trimmed)
		}
	}

	return monkeys
}

func parseStartingItems(l string) []*big.Int {
	// This is so gross; pls use a regex
	p1 := strings.TrimSpace(strings.Split(l, ":")[1])
	p2 := strings.Split(p1, ",")

	items := make([]*big.Int, 0)
	for _, p := range p2 {
		i, _ := strconv.Atoi(strings.TrimSpace(p))
		items = append(items, big.NewInt(int64(i)))
	}

	return items
}

func parseOperation(line string) MonkeyFn {
	parts := ore.FindAllStringSubmatch(line, -1)[0]
	operand := parts[1]
	val, err := strconv.Atoi(parts[2])
	bigval := big.NewInt(int64(val))

	switch operand {
	case "+":
		return func(old *big.Int) *big.Int {
			if err != nil {
				return old.Add(old, old)
			}
			return old.Add(old, bigval)
		}
	case "*":
		return func(old *big.Int) *big.Int {
			if err != nil {
				return old.Mul(old, old)
			}
			return old.Mul(old, bigval)
		}
	default:
		panic("Unrecognized operand")
	}
}

func parseTestDivisor(line string) *big.Int {
	m := dre.FindAllStringSubmatch(line, -1)[0][1]
	i, err := strconv.Atoi(m)
	if err != nil {
		panic(err)
	}
	return big.NewInt(int64(i))
}

func parseTargetMonkey(line string) int {
	split := strings.Split(line, " ")
	p := split[len(split)-1]
	i, err := strconv.Atoi(p)
	if err != nil {
		panic(err)
	}
	return i
}
