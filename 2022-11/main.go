package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	input := util.ReadInput()
	partOne(input)
}

type MonkeyFn func(old int) int
type Monkey struct {
	id          int
	items       []int
	operation   MonkeyFn
	testDivisor int
	testTrue    int
	testFalse   int
	count       int
}

func partOne(input []string) {
	monkeys := parseMonkeys(input)

	allDivisors := 1
	for _, m := range monkeys {
		allDivisors *= m.testDivisor
	}

	round := 1
	maxRounds := 10000

	for {
		if round > maxRounds {
			break
		}

		// fmt.Printf("Round %d\n", round)

		for _, monkey := range monkeys {
			// fmt.Printf("\tMonkey %d:\n", monkey.id)
			for _, initialWorry := range monkey.items {

				// fmt.Printf("\t\tMonkey inspects an item with worry level of %d\n", initialWorry)
				// After each monkey inspects an item but before it tests your worry level,
				// your relief that the monkey's inspection didn't damage the item causes
				// your worry level to be divided by three and rounded down to the nearest integer.
				worry := monkey.operation(initialWorry)
				// fmt.Printf("\t\t\tWorry level after operation is %d\n", worry)
				// fmt.Printf("\t")
				// worry = worry / 3
				// fmt.Printf("\t\t\tWorry level is divided and is now %d\n", worry)

				worry = worry % allDivisors

				test := worry%monkey.testDivisor == 0

				// fmt.Printf("\t\t\tDoes test pass? %t\n", test)

				monkey.count++

				var nextMonkey int
				switch test {
				case true:
					nextMonkey = monkey.testTrue
				case false:
					nextMonkey = monkey.testFalse
				}

				monkeys[nextMonkey].items = append(monkeys[nextMonkey].items, worry)
			}
			monkey.items = make([]int, 0)
		}

		// allEmpty := true

		if round == 20 || round%1000 == 0 {
			fmt.Printf("=== After round %d ====\n", round)
			for _, m := range monkeys {
				fmt.Printf("monkey %d: %d\n", m.id, m.count)
				// if len(m.items) != 0 {
				// allEmpty = false
				// }
			}
		}

		round++
	}

	biggest := 0
	secondBiggest := 0
	for _, m := range monkeys {
		// fmt.Printf("monkey %d: %d\n", m.id, m.count)
		switch {
		case m.count > biggest:
			secondBiggest = biggest
			biggest = m.count
		case m.count > secondBiggest:
			secondBiggest = m.count
		}
	}

	fmt.Println(biggest, secondBiggest, biggest*secondBiggest)
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

func parseStartingItems(l string) []int {
	// This is so gross; pls use a regex
	p1 := strings.TrimSpace(strings.Split(l, ":")[1])
	p2 := strings.Split(p1, ",")

	items := make([]int, 0)
	for _, p := range p2 {
		i, _ := strconv.Atoi(strings.TrimSpace(p))
		items = append(items, i)
	}

	return items
}

func parseOperation(line string) MonkeyFn {
	parts := ore.FindAllStringSubmatch(line, -1)[0]
	operand := parts[1]
	val, err := strconv.Atoi(parts[2])

	switch operand {
	case "+":
		return func(old int) int {
			if err != nil {
				return old + old
			}
			return old + val
		}
	case "*":
		return func(old int) int {
			if err != nil {
				return old * old
			}
			return old * val
		}
	default:
		panic("Unrecognized operand")
	}
}

func parseTestDivisor(line string) int {
	m := dre.FindAllStringSubmatch(line, -1)[0][1]
	i, err := strconv.Atoi(m)
	if err != nil {
		panic(err)
	}
	return i
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
