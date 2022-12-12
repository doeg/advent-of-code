package main

import (
	"math/big"
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
		inputs   []*big.Int
		expected []*big.Int
	}{
		{
			str: "Operation: new = old * 19",
			inputs: []*big.Int{
				big.NewInt(int64(79)),
				big.NewInt(int64(98)),
			},
			expected: []*big.Int{
				big.NewInt(int64(1501)),
				big.NewInt(int64(1862)),
			},
		},
		{
			str: "Operation: new = old + 6",
			inputs: []*big.Int{
				big.NewInt(int64(54)),
				big.NewInt(int64(65)),
				big.NewInt(int64(75)),
				big.NewInt(int64(74)),
			},
			expected: []*big.Int{
				big.NewInt(int64(60)),
				big.NewInt(int64(71)),
				big.NewInt(int64(81)),
				big.NewInt(int64(80)),
			},
		},
		{
			str: "Operation: new = old * old",
			inputs: []*big.Int{
				big.NewInt(int64(79)),
				big.NewInt(int64(60)),
				big.NewInt(int64(97)),
			},
			expected: []*big.Int{
				big.NewInt(int64(6241)),
				big.NewInt(int64(3600)),
				big.NewInt(int64(9409)),
			},
		},
		{
			str: "Operation: new = old + old",
			inputs: []*big.Int{
				big.NewInt(int64(74)),
			},
			expected: []*big.Int{
				big.NewInt(int64(148)),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.str, func(t *testing.T) {
			fn := parseOperation(tt.str)
			for i, old := range tt.inputs {
				result := fn(old)
				expected := tt.expected[i]
				if result.Cmp(expected) != 0 {
					t.Errorf("Input: %d, expected: %d, result: %d", old, expected, result)
				}
			}
		})
	}
}
