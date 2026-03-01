package handlers

import (
	"encoding/json"
	"net/http"

	"sezzle-calculator/calculator"
)

// CalculateRequest represents the JSON body for calculation requests
type CalculateRequest struct {
	A          float64 `json:"a"`
	B          float64 `json:"b,omitempty"`
	Operation  string  `json:"operation"`
}

// CalculateResponse represents the JSON response
type CalculateResponse struct {
	Result float64 `json:"result"`
	Error  string  `json:"error,omitempty"`
}

// CalculatorHandler handles calculator API requests
type CalculatorHandler struct{}

// ServeHTTP implements http.Handler
func (h *CalculatorHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CalculateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	op := calculator.Operation(req.Operation)

	if calculator.IsUnary(op) {
		result, err := calculator.Calculate(req.A, 0, op)
		if err != nil {
			writeCalcError(w, err)
			return
		}
		writeResult(w, result)
		return
	}

	result, err := calculator.Calculate(req.A, req.B, op)
	if err != nil {
		writeCalcError(w, err)
		return
	}
	writeResult(w, result)
}

func writeResult(w http.ResponseWriter, result float64) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(CalculateResponse{Result: result})
}

func writeError(w http.ResponseWriter, msg string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(CalculateResponse{Error: msg})
}

func writeCalcError(w http.ResponseWriter, err error) {
	status := http.StatusBadRequest
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(CalculateResponse{Error: err.Error()})
}
