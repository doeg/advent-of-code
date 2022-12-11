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
}

func partOne(input []string) {
	monkeys := parseMonkeys(input)

	for _, m := range monkeys {
		fmt.Printf("%+v\n\n", m)
	}
}

// Regexes are kind of slow, but it's good practice!
var mre = regexp.MustCompile(`^Monkey (\d+):$`)
var sre = regexp.MustCompile(`^Starting items: (?:(\d+)(?:,\s)?)+$`)
var ore = regexp.MustCompile(`^Operation: new = old ([+*]) (\w+)`)

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
