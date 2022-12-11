package main

import (
	"reflect"
	"testing"
)

func TestParseStartingItems(t *testing.T) {
	tests := []struct {
		str      string
		expected []int
	}{
		{
			str:      "Starting items: 79, 98",
			expected: []int{79, 98},
		},
		{
			str:      "Starting items: 54, 65, 75, 74",
			expected: []int{54, 65, 75, 74},
		},
		{
			str:      "Starting items: 79, 60, 97",
			expected: []int{79, 60, 97},
		},
		{
			str:      "Starting items: 74",
			expected: []int{74},
		},
	}

	for _, tt := range tests {
		t.Run(tt.str, func(t *testing.T) {
			result := parseStartingItems(tt.str)
			if !reflect.DeepEqual(result, tt.expected) {
				t.Errorf("expected %v, but got %v", tt.expected, result)
			}
		})
	}
}

func TestParseOperand(t *testing.T) {
	tests := []struct {
		str      string
		inputs   []int
		expected []int
	}{
		{
			str:      "Operation: new = old * 19",
			inputs:   []int{79, 98},
			expected: []int{1501, 1862},
		},
		{
			str:      "Operation: new = old + 6",
			inputs:   []int{54, 65, 75, 74},
			expected: []int{60, 71, 81, 80},
		},
		{
			str:      "Operation: new = old * old",
			inputs:   []int{79, 60, 97},
			expected: []int{6241, 3600, 9409},
		},
		{
			str:      "Operation: new = old + old",
			inputs:   []int{74},
			expected: []int{148},
		},
	}

	for _, tt := range tests {
		t.Run(tt.str, func(t *testing.T) {
			fn := parseOperation(tt.str)
			for i, old := range tt.inputs {
				result := fn(old)
				expected := tt.expected[i]
				if result != expected {
					t.Errorf("Input: %d, expected: %d, result: %d", old, expected, result)
				}
			}
		})
	}
}
