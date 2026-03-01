package calculator

import (
	"math"
)

// Operation represents supported calculator operations
type Operation string

const (
	Add      Operation = "add"
	Subtract Operation = "subtract"
	Multiply Operation = "multiply"
	Divide   Operation = "divide"
	Power    Operation = "power"
	Sqrt     Operation = "sqrt"
	Percent  Operation = "percent"
)

// Calculate performs the requested operation on the given operands
func Calculate(a, b float64, op Operation) (float64, error) {
	switch op {
	case Add:
		return a + b, nil
	case Subtract:
		return a - b, nil
	case Multiply:
		return a * b, nil
	case Divide:
		if b == 0 {
			return 0, ErrDivisionByZero
		}
		return a / b, nil
	case Power:
		return math.Pow(a, b), nil
	case Sqrt:
		if a < 0 {
			return 0, ErrNegativeSqrt
		}
		return math.Sqrt(a), nil
	case Percent:
		return (a * b) / 100, nil
	default:
		return 0, ErrInvalidOperation
	}
}

// IsUnary returns true if the operation only needs one operand
func IsUnary(op Operation) bool {
	return op == Sqrt
}
