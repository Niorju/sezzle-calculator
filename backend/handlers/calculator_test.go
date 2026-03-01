package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCalculatorHandler_Add(t *testing.T) {
	req := CalculateRequest{A: 10, B: 5, Operation: "add"}
	body, _ := json.Marshal(req)

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodPost, "/api/calculate", bytes.NewReader(body))
	r.Header.Set("Content-Type", "application/json")

	h := &CalculatorHandler{}
	h.ServeHTTP(w, r)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var resp CalculateResponse
	json.NewDecoder(w.Body).Decode(&resp)
	if resp.Result != 15 {
		t.Errorf("expected result 15, got %v", resp.Result)
	}
}

func TestCalculatorHandler_DivideByZero(t *testing.T) {
	req := CalculateRequest{A: 10, B: 0, Operation: "divide"}
	body, _ := json.Marshal(req)

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodPost, "/api/calculate", bytes.NewReader(body))
	r.Header.Set("Content-Type", "application/json")

	h := &CalculatorHandler{}
	h.ServeHTTP(w, r)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d", w.Code)
	}

	var resp CalculateResponse
	json.NewDecoder(w.Body).Decode(&resp)
	if resp.Error == "" {
		t.Error("expected error message")
	}
}

func TestCalculatorHandler_Sqrt(t *testing.T) {
	req := CalculateRequest{A: 16, Operation: "sqrt"}
	body, _ := json.Marshal(req)

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodPost, "/api/calculate", bytes.NewReader(body))
	r.Header.Set("Content-Type", "application/json")

	h := &CalculatorHandler{}
	h.ServeHTTP(w, r)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var resp CalculateResponse
	json.NewDecoder(w.Body).Decode(&resp)
	if resp.Result != 4 {
		t.Errorf("expected result 4, got %v", resp.Result)
	}
}

func TestCalculatorHandler_InvalidJSON(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodPost, "/api/calculate", bytes.NewReader([]byte("invalid")))
	r.Header.Set("Content-Type", "application/json")

	h := &CalculatorHandler{}
	h.ServeHTTP(w, r)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d", w.Code)
	}
}

func TestCalculatorHandler_MethodNotAllowed(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/api/calculate", nil)

	h := &CalculatorHandler{}
	h.ServeHTTP(w, r)

	if w.Code != http.StatusMethodNotAllowed {
		t.Errorf("expected status 405, got %d", w.Code)
	}
}
