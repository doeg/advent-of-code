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
	pairIndex := 1
	sum := 0

	for i := 0; i < len(input)-1; {
		line := input[i]
		switch line {
		case "":
			i++
		default:
			result := compare(input[i], input[i+1])
			if result {
				sum += pairIndex
			}
			i += 2
			pairIndex++
		}
	}

	fmt.Println(sum)
}

func compare(leftInput, rightInput string) bool {
	left := parse(leftInput)
	right := parse(rightInput)
	result, certain := compareLists(left.children, right.children)
	if !certain {
		panic("Uncertain")
	}
	return result
}

func compareLists(left, right []*Node) (bool, bool) {

	pos := 0

	for {
		// If the left list runs out of items first, the inputs are in the right order.
		if pos >= len(left) && pos < len(right) {
			return true, true
		}

		// If the right list runs out of items first, the inputs are not in the right order.
		if pos < len(left) && pos >= len(right) {
			return false, true
		}

		if pos >= len(left) && pos >= len(right) {
			return true, false
		}

		ln := left[pos]
		rn := right[pos]

		// If both values are integers, the lower integer should come first.
		if ln.nodeType == NODE_INT && rn.nodeType == NODE_INT {
			// If the left integer is lower than the right integer, the inputs are in the right order.
			if ln.value < rn.value {
				return true, true
			}

			// If the left integer is higher than the right integer, the inputs are not in the right order.
			if ln.value > rn.value {
				return false, true
			}

			// Otherwise, the inputs are the same integer; continue checking the next part of the input.
			pos++
			continue
		}

		// If both values are lists, compare the first value of each list, then the second value, and so on.
		if ln.nodeType == NODE_LIST && rn.nodeType == NODE_LIST {
			result, certain := compareLists(ln.children, rn.children)
			if certain {
				return result, true
			}

			// If the lists are the same length and no comparison makes a decision about the order,
			// continue checking the next part of the input.
			pos++
			continue
		}

		// If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, then retry the comparison.
		if ln.nodeType == NODE_INT && rn.nodeType == NODE_LIST {
			result, certain := compareLists([]*Node{ln}, rn.children)
			if certain {
				return result, true
			}

			// If the lists are the same length and no comparison makes a decision about the order,
			// continue checking the next part of the input.
			pos++
			continue
		}

		if ln.nodeType == NODE_LIST && rn.nodeType == NODE_INT {
			result, certain := compareLists(ln.children, []*Node{rn})
			if certain {
				return result, true
			}

			// If the lists are the same length and no comparison makes a decision about the order,
			// continue checking the next part of the input.
			pos++
			continue
		}

		pos++
	}
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

func (node *Node) toString() string {
	switch node.nodeType {
	case NODE_INT:
		return fmt.Sprintf("INT{%d}", node.value)
	case NODE_LIST:
		s := "LIST{"
		for _, c := range node.children {
			s += c.toString()
		}
		s += "}"
		return s
	default:
		return ""
	}
}

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
