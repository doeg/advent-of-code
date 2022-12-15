package main

import (
	"fmt"
	"testing"
)

func TestCompare(t *testing.T) {
	tests := []struct {
		left     string
		right    string
		expected bool
	}{
		{
			left:     "[1,1,3,1,1]",
			right:    "[1,1,5,1,1]",
			expected: true,
		},
		{
			left:     "[[1],[2,3,4]]",
			right:    "[[1],4]",
			expected: true,
		},
		{
			left:     "[9]",
			right:    "[[8,7,6]]",
			expected: false,
		},
		{
			left:     "[[4,4],4,4]",
			right:    "[[4,4],4,4,4]",
			expected: true,
		},
		{
			left:     "[7,7,7,7]",
			right:    "[7,7,7]",
			expected: false,
		},
		{
			left:     "[]",
			right:    "[3]",
			expected: true,
		},
		{
			left:     "[[[]]]",
			right:    "[[]]",
			expected: false,
		},
		{
			left:     "[1,[2,[3,[4,[5,6,7]]]],8,9]",
			right:    "[1,[2,[3,[4,[5,6,0]]]],8,9]",
			expected: false,
		},
	}

	for _, tt := range tests {
		name := fmt.Sprintf("Compare %s vs %s", tt.left, tt.right)
		t.Run(name, func(t *testing.T) {
			result := compare(tt.left, tt.right)
			if result != tt.expected {
				t.Errorf("expected %t, but got %t", tt.expected, result)
			}
		})
	}
}
