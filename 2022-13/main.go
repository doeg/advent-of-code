package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/doeg/advent-of-code/util"
)

func main() {
	input := util.ReadInput()
	partOne(input)
}

func partOne(input []string) {
	for i := 0; i < len(input)-1; {
		line := input[i]
		switch line {
		case "":
			i++
		default:
			compare(input[i], input[i+1])
			i += 2
		}
	}
}

func compare(leftInput, rightInput string) {
	left := parse(leftInput)
	printTree(left, 0)
}

type Node struct {
	nodeType NodeType
	parent   *Node
	children []*Node // Only defined for NODE_LISTs, otherwise nil
	value    int     // Only defined for NODE_INTs
}

type NodeType int

const (
	NODE_LIST NodeType = iota
	NODE_INT
)

func parse(input string) *Node {
	tokens := lex(input)

	// Start at 1 to "skip" the initial opening brace
	initialPos := 1
	root, _ := parseList(tokens, nil, initialPos)
	return root
}

// parseList parses a list of tokens into a tree and returns
// the root node. "pos" should skip the position of the opening
// brace... this is weird and could probably be fixed.
func parseList(tokens []*Token, parent *Node, startPos int) (*Node, int) {
	node := &Node{
		nodeType: NODE_LIST,
		parent:   parent,
		children: make([]*Node, 0),
	}

	pos := startPos

	for pos < len(tokens) {
		token := tokens[pos]
		switch token.tokenType {
		case TOKEN_INTEGER:
			node.children = append(node.children, &Node{
				nodeType: NODE_INT,
				parent:   node,
				value:    token.value,
			})
			pos++
		case TOKEN_LIST_START:
			sublist, newPos := parseList(tokens, node, pos+1)
			node.children = append(node.children, sublist)
			pos = newPos
		case TOKEN_LIST_END:
			pos++
			return node, pos
		case TOKEN_COMMA:
			pos++
			continue
		default:
			panic("Unrecognized token")
		}
	}

	return node, pos
}

func printTree(node *Node, depth int) {
	prefix := ""
	if depth > 0 {
		prefix = strings.Repeat("    ", depth) + "|──"
	}

	switch node.nodeType {
	case NODE_INT:
		fmt.Println(prefix, node.value)
	case NODE_LIST:
		fmt.Println(prefix, ".")
		for _, n := range node.children {
			printTree(n, depth+1)
		}
	}
}

type TokenType string

const (
	TOKEN_LIST_START = "TOKEN_LIST_START"
	TOKEN_LIST_END   = "TOKEN_LIST_END"
	TOKEN_INTEGER    = "TOKEN_INTEGER"
	TOKEN_COMMA      = "TOKEN_COMMA"
)

type Token struct {
	tokenType string
	value     int
}

func lex(input string) []*Token {
	tokens := make([]*Token, 0)

	intBuffer := ""

	for _, r := range input {
		switch r {
		case '[':
			tokens = append(tokens, &Token{tokenType: TOKEN_LIST_START})
		case ']':
			if intBuffer != "" {
				intToken := lexInt(intBuffer)
				intBuffer = ""
				tokens = append(tokens, intToken)
			}
			tokens = append(tokens, &Token{tokenType: TOKEN_LIST_END})
		case ',':
			if intBuffer != "" {
				intToken := lexInt(intBuffer)
				intBuffer = ""
				tokens = append(tokens, intToken)
			}
			tokens = append(tokens, &Token{tokenType: TOKEN_COMMA})
		default:
			intBuffer += string(r)
		}
	}
	return tokens
}

func lexInt(intBuffer string) *Token {
	i, err := strconv.Atoi(intBuffer)
	if err != nil {
		panic(err)
	}
	return &Token{tokenType: TOKEN_INTEGER, value: i}
}

// // // type Node struct {
// // // 	parent   *Node
// // // 	nodeType NodeType
// // // 	children []*Node
// // // 	value    int
// // // }

// // // type NodeType int

// // // const (
// // // 	List NodeType = iota
// // // 	Number
// // // )

// // // func parse(input string) *Node {
// // // 	data := strings.Split(input, "")
// // // 	for _, datum := range data {
// // // 		fmt.Print(datum)
// // // 	}
// // // 	fmt.Println()
// // // }

// // // // // Returns true if left and right packets are in the correct order.
// // // // //
// // // // // Packet data consists of lists and integers. Each list starts with [, ends with ],
// // // // // and contains zero or more comma-separated values (either integers or other lists).
// // // // func compare(left, right string) bool {
// // // // 	fmt.Println("FIRST", left)
// // // // 	fmt.Println("SECOND", right)

// // // // 	// get the next item in the list
// // // // 	// maybe it can be an Item struct with a pointer to a list type and a value type?
// // // // 	// and that pointer to the list can be nil if the item is a value and vice versa.
// // // // 	// and: lists can contain pointers to their values... which suggests that I should
// // // // 	// build the parse tree ahead of time.
// // // // 	//
// // // // 	// leftNext := left.getNext()
// // // // 	// rightNext := right.getNext()

// // // // 	switch {
// // // // 	// If both values are integers, the lower integer should come first.
// // // // 	case leftNext.tokenType == tokenType.value && rightNext.tokenType == tokenType.value:
// // // // 		switch {
// // // // 		// If the left integer is lower than the right integer, the inputs are in the right order.
// // // // 		case leftNext.value < rightNext.value:
// // // // 			return true
// // // // 		// If the left integer is higher than the right integer, the inputs are not in the right order.
// // // // 		case leftNext.value > rightNext.value:
// // // // 			return false
// // // // 		// Otherwise, the inputs are the same integer; continue checking the next part of the input.
// // // // 		case leftNext.value == rightNext.value:
// // // // 			continue
// // // // 		}

// // // // 	// If both values are lists, compare the first value of each list, then the second value, and so on.
// // // // 	case leftNext.tokenType == tokenType.list && rightNext.tokenType == tokenType.list:
// // // // 		// If the left list runs out of items first, the inputs are in the right order.
// // // // 		// If the right list runs out of items first, the inputs are not in the right order.
// // // // 		// If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.

// // // // 	// If exactly one value is an integer, convert the integer to a list which contains that integer as its only value,
// // // // 	// then retry the comparison. For example, if comparing [0,0,0] and 2, convert the right value to [2] (a list containing 2);
// // // // 	// the result is then found by instead comparing [0,0,0] and [2].
// // // // 	case leftNext.tokenType == tokenType.list && rightNext.tokenType == tokenType.value:
// // // // 	case leftNext.tokenType == tokenType.value && rightNext.tokenType == tokenType.list:

// // // // 	default:
// // // // 		panic("Unhandled case")
// // // // 	}

// // // // 	return false
// // // // }
