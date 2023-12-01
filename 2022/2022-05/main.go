package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/doeg/advent-of-code/util"
)

// This is disgusting and I am not proud of it.
func main() {
	partOne()
	partTwo()
}

func partOne() {
	input := util.ReadInput()

	ci := regexp.MustCompile(`\[([A-Z])\]*`)
	ni := regexp.MustCompile(`^\s(?:(\d)\s{1,3})*$`)
	mi := regexp.MustCompile(`^move (\d+) from (\d) to (\d)$`)

	var crateLines []string
	var stackCount int
	var instructions [][]int

	// Parse input
	for _, line := range input {
		if ci.MatchString(line) {
			crateLines = append(crateLines, line)
			continue
		}

		if ni.MatchString(line) {
			matches := ni.FindAllStringSubmatch(line, -1)
			stackCount, _ = strconv.Atoi(matches[0][1])
			continue
		}

		if mi.MatchString(line) {
			matches := mi.FindAllStringSubmatch(line, -1)

			// These are still 1-indexed
			count, _ := strconv.Atoi(matches[0][1])
			from, _ := strconv.Atoi(matches[0][2])
			to, _ := strconv.Atoi(matches[0][3])

			instructions = append(instructions, []int{count, from, to})
			continue
		}
	}

	// Further parse the crates section of the input,
	// starting from the bottom of the crates and going up.
	// Ugh this is so gross... there has to be a better way...
	stacks := make([][]string, stackCount)

	i := len(crateLines) - 1
	for i >= 0 {
		// Trim/normalize the line so it's easier to traverse
		l := crateLines[i]
		nl := l[1 : len(l)-1]

		j := 0
		for j < stackCount {
			c := string(nl[j*4])
			stacks[j] = append(stacks[j], c)
			j++
		}

		i--
	}

	for in, instruction := range instructions {
		count := instruction[0]
		fromIdx := instruction[1] - 1
		toIdx := instruction[2] - 1

		// Trim the source stack. This would be easier if I just used strings...
		sourceStack := strings.Split(strings.Trim(strings.Join(stacks[fromIdx], ""), " "), "")

		if len(sourceStack)-count < 0 {
			panic(fmt.Sprintf("%d error trying to move %d from %d to %d (stack: %v)", in, count, instruction[1], instruction[2], sourceStack))
		}

		ss := len(sourceStack) - count
		targetCrates, newSource := sourceStack[ss:], sourceStack[:ss]
		stacks[fromIdx] = newSource

		// Trim the destination stack so we're not appending on top of whitespace
		stacks[toIdx] = strings.Split(strings.Trim(strings.Join(stacks[toIdx], ""), " "), "")

		t := len(targetCrates) - 1
		for t >= 0 {
			stacks[toIdx] = append(stacks[toIdx], targetCrates[t])
			t--
		}
	}

	// Print the topmost letter of each stack
	for _, s := range stacks {
		ss := len(s) - 1
		if ss >= 0 {
			fmt.Print(s[ss])
		} else {
			fmt.Print(" ")
		}
	}
	fmt.Println()
}

func partTwo() {
	input := util.ReadInput()

	ci := regexp.MustCompile(`\[([A-Z])\]*`)
	ni := regexp.MustCompile(`^\s(?:(\d)\s{1,3})*$`)
	mi := regexp.MustCompile(`^move (\d+) from (\d) to (\d)$`)

	var crateLines []string
	var stackCount int
	var instructions [][]int

	// Parse input
	for _, line := range input {
		if ci.MatchString(line) {
			crateLines = append(crateLines, line)
			continue
		}

		if ni.MatchString(line) {
			matches := ni.FindAllStringSubmatch(line, -1)
			stackCount, _ = strconv.Atoi(matches[0][1])
			continue
		}

		if mi.MatchString(line) {
			matches := mi.FindAllStringSubmatch(line, -1)

			// These are still 1-indexed
			count, _ := strconv.Atoi(matches[0][1])
			from, _ := strconv.Atoi(matches[0][2])
			to, _ := strconv.Atoi(matches[0][3])

			instructions = append(instructions, []int{count, from, to})
			continue
		}
	}

	// Further parse the crates section of the input,
	// starting from the bottom of the crates and going up.
	// Ugh this is so gross... there has to be a better way...
	stacks := make([][]string, stackCount)

	i := len(crateLines) - 1
	for i >= 0 {
		// Trim/normalize the line so it's easier to traverse
		l := crateLines[i]
		nl := l[1 : len(l)-1]

		j := 0
		for j < stackCount {
			c := string(nl[j*4])
			stacks[j] = append(stacks[j], c)
			j++
		}

		i--
	}

	for in, instruction := range instructions {
		count := instruction[0]
		fromIdx := instruction[1] - 1
		toIdx := instruction[2] - 1

		// Trim the source stack. This would be easier if I just used strings...
		sourceStack := strings.Split(strings.Trim(strings.Join(stacks[fromIdx], ""), " "), "")

		if len(sourceStack)-count < 0 {
			panic(fmt.Sprintf("%d error trying to move %d from %d to %d (stack: %v)", in, count, instruction[1], instruction[2], sourceStack))
		}

		ss := len(sourceStack) - count
		targetCrates, newSource := sourceStack[ss:], sourceStack[:ss]
		stacks[fromIdx] = newSource

		// Trim the destination stack so we're not appending on top of whitespace
		stacks[toIdx] = strings.Split(strings.Trim(strings.Join(stacks[toIdx], ""), " "), "")

		for t := 0; t < len(targetCrates); t++ {
			stacks[toIdx] = append(stacks[toIdx], targetCrates[t])
		}
	}

	// Print the topmost letter of each stack
	for _, s := range stacks {
		ss := len(s) - 1
		if ss >= 0 {
			fmt.Print(s[ss])
		} else {
			fmt.Print(" ")
		}
	}
	fmt.Println()
}

func DebugStacks(stacks [][]string) {
	maxLen := -1
	for i := range stacks {
		l := len(stacks[i])
		if l > maxLen {
			maxLen = l
		}
	}

	i := maxLen
	acc := make([]string, len(stacks))

	for i >= 0 {
		for s, stack := range stacks {
			if i >= len(stack) {
				acc[s] = "[ ]"
			} else {
				acc[s] = fmt.Sprintf("[%s]", stack[i])
			}
		}
		fmt.Println(strings.Join(acc, " "))
		i--
	}

	j := 1
	buff := " "
	for j <= len(stacks) {
		buff += fmt.Sprintf("%d   ", j)
		j++
	}
	fmt.Println(buff)
}
