package calculator

import (
	"math"
	"testing"
)

func TestCalculate_Add(t *testing.T) {
	result, err := Calculate(10, 5, Add)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 15 {
		t.Errorf("expected 15, got %v", result)
	}
}

func TestCalculate_Subtract(t *testing.T) {
	result, err := Calculate(10, 5, Subtract)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 5 {
		t.Errorf("expected 5, got %v", result)
	}
}

func TestCalculate_Multiply(t *testing.T) {
	result, err := Calculate(10, 5, Multiply)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 50 {
		t.Errorf("expected 50, got %v", result)
	}
}

func TestCalculate_Divide(t *testing.T) {
	result, err := Calculate(10, 5, Divide)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 2 {
		t.Errorf("expected 2, got %v", result)
	}
}

func TestCalculate_DivideByZero(t *testing.T) {
	_, err := Calculate(10, 0, Divide)
	if err != ErrDivisionByZero {
		t.Errorf("expected ErrDivisionByZero, got %v", err)
	}
}

func TestCalculate_Power(t *testing.T) {
	result, err := Calculate(2, 3, Power)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 8 {
		t.Errorf("expected 8, got %v", result)
	}
}

func TestCalculate_Sqrt(t *testing.T) {
	result, err := Calculate(16, 0, Sqrt)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if math.Abs(result-4) > 1e-9 {
		t.Errorf("expected 4, got %v", result)
	}
}

func TestCalculate_SqrtNegative(t *testing.T) {
	_, err := Calculate(-1, 0, Sqrt)
	if err != ErrNegativeSqrt {
		t.Errorf("expected ErrNegativeSqrt, got %v", err)
	}
}

func TestCalculate_Percent(t *testing.T) {
	result, err := Calculate(200, 10, Percent)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result != 20 {
		t.Errorf("expected 20, got %v", result)
	}
}

func TestCalculate_InvalidOperation(t *testing.T) {
	_, err := Calculate(10, 5, Operation("invalid"))
	if err != ErrInvalidOperation {
		t.Errorf("expected ErrInvalidOperation, got %v", err)
	}
}

func TestIsUnary(t *testing.T) {
	if !IsUnary(Sqrt) {
		t.Error("Sqrt should be unary")
	}
	if IsUnary(Add) {
		t.Error("Add should not be unary")
	}
}
