package calculator

import "errors"

var (
	ErrDivisionByZero   = errors.New("division by zero")
	ErrNegativeSqrt     = errors.New("cannot calculate square root of negative number")
	ErrInvalidOperation = errors.New("invalid operation")
)
