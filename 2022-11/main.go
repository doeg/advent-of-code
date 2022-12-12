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
	monke(input, 20, true)     // One
	monke(input, 10000, false) // partTwo
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

func monke(input []string, maxRounds int, shouldDivide bool) {
	monkeys := parseMonkeys(input)

	allDivisors := 1
	for _, m := range monkeys {
		allDivisors *= m.testDivisor
	}

	round := 1
	for {
		if round > maxRounds {
			break
		}

		for _, monkey := range monkeys {
			for _, initialWorry := range monkey.items {
				monkey.count++

				worry := monkey.operation(initialWorry)

				if shouldDivide {
					worry = worry / 3
				} else {
					worry = worry % allDivisors
				}

				test := worry%monkey.testDivisor == 0

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
		round++
	}

	biggest := 0
	secondBiggest := 0
	for _, m := range monkeys {
		switch {
		case m.count > biggest:
			secondBiggest = biggest
			biggest = m.count
		case m.count > secondBiggest:
			secondBiggest = m.count
		}
	}

	fmt.Println(biggest * secondBiggest)
}

// Regexes are kind of slow, but it's good practice! I guess!!!!!!
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
	// wtf use the regexes
	m := dre.FindAllStringSubmatch(line, -1)[0][1]
	i, err := strconv.Atoi(m)
	if err != nil {
		panic(err)
	}
	return i
}

func parseTargetMonkey(line string) int {
	// wtf use the regexes etc etc
	split := strings.Split(line, " ")
	p := split[len(split)-1]
	i, err := strconv.Atoi(p)
	if err != nil {
		panic(err)
	}
	return i
}
