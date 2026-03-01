# Sezzle Calculator - Full-Stack Application

A full-stack calculator application with a React (TypeScript) frontend and a Go REST API backend. The frontend consumes the backend API to perform basic and advanced arithmetic operations.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [How to Run](#how-to-run)
- [API Reference](#api-reference)
- [Example API Calls](#example-api-calls)
- [Running Tests](#running-tests)
- [Design Decisions & Assumptions](#design-decisions--assumptions)

---

## Features

- **Operations:** Addition, Subtraction, Multiplication, Division, Exponentiation (x²), Square Root, Percentage
- **Frontend:** Intuitive UI, input validation, error handling, responsive design (mobile support)
- **Backend:** REST API with input validation and edge case handling (division by zero, invalid data)
- **Tests:** Unit tests for both frontend and backend with coverage reports

## Prerequisites

Choose one of the options below:

| Option | Requirements |
|--------|--------------|
| **Docker (recommended)** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running |
| **Manual** | [Go](https://go.dev/dl/) 1.21+ and [Node.js](https://nodejs.org/) 18+ with npm |

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd sezzle
```

### 2. Choose your run method

- **Docker:** No additional setup needed. Ensure Docker Desktop is running.
- **Manual:** Ensure Go and Node.js are installed and available in your PATH.

---

## How to Run

### Option A: Using Docker (Recommended)

Runs both frontend and backend in containers. Best for quick testing.

```bash
docker-compose up --build
```

Wait for the build to complete. Then:

- **Frontend (Calculator UI):** http://localhost
- **Backend API:** http://localhost:8080

To run in detached mode (background):

```bash
docker-compose up --build -d
```

To stop:

```bash
docker-compose down
```

### Option B: Running Manually

#### Step 1: Start the Backend

```bash
cd backend
go mod download
go run main.go
```

The API will be available at **http://localhost:8080**. Keep this terminal open.

#### Step 2: Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**. The frontend proxies `/api` requests to the backend automatically.

---

## API Reference

### POST /api/calculate

Performs a calculator operation.

**Request (JSON body):**

| Field       | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| `a`         | number | yes      | First operand                                    |
| `b`         | number | no*      | Second operand (*required for binary operations) |
| `operation` | string | yes      | See supported operations below                   |

**Supported operations:**

| Operation  | Description                    | Example        |
|------------|--------------------------------|----------------|
| `add`      | Addition (a + b)               | 10 + 5 = 15    |
| `subtract` | Subtraction (a - b)             | 10 - 5 = 5     |
| `multiply` | Multiplication (a × b)         | 10 × 5 = 50    |
| `divide`   | Division (a ÷ b)                | 10 ÷ 5 = 2     |
| `power`    | Exponentiation (a^b)           | 2^3 = 8        |
| `sqrt`     | Square root (√a) — unary only   | √16 = 4        |
| `percent`  | Percentage ((a × b) / 100)      | 200, 10% = 20  |

**Success response (200 OK):**

```json
{ "result": 15 }
```

**Error response (400 Bad Request):**

```json
{ "error": "division by zero" }
```

---

## Example API Calls

### Using cURL (Linux/macOS/Git Bash)

```bash
# Addition: 10 + 5 = 15
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 5, "operation": "add"}'

# Subtraction: 20 - 7 = 13
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"a": 20, "b": 7, "operation": "subtract"}'

# Division by zero (returns error)
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 0, "operation": "divide"}'

# Square root: √16 = 4
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"a": 16, "operation": "sqrt"}'

# Percentage: 10% of 200 = 20
curl -X POST http://localhost:8080/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"a": 200, "b": 10, "operation": "percent"}'
```

### Using PowerShell (Windows)

```powershell
# Addition: 10 + 5 = 15
Invoke-RestMethod -Uri "http://localhost:8080/api/calculate" -Method POST -ContentType "application/json" -Body '{"a": 10, "b": 5, "operation": "add"}'

# Square root: √16 = 4
Invoke-RestMethod -Uri "http://localhost:8080/api/calculate" -Method POST -ContentType "application/json" -Body '{"a": 16, "operation": "sqrt"}'
```

---

## Running Tests

### Backend (Go)

```bash
cd backend
go test ./... -cover
```

### Frontend (Vitest)

```bash
cd frontend
npm run test
```

### Coverage Reports

```bash
# Backend
cd backend
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out

# Frontend
cd frontend
npm run test:coverage
```

---

## Design Decisions & Assumptions

### Architecture

1. **Single REST endpoint:** One `POST /api/calculate` endpoint with an `operation` field instead of separate routes per operation. This keeps the API simple, consistent, and easy to extend with new operations.

2. **Separation of concerns:** Business logic (calculator operations) lives in the `calculator` package; HTTP handling is in `handlers`. This improves testability and maintainability.

### Frontend

3. **Vite proxy:** During development, Vite proxies `/api` to the backend. The frontend uses relative URLs (`/api/calculate`), avoiding CORS issues and simplifying deployment (same origin in production via nginx).

4. **Calculator UX:** Standard flow: enter number → operation → number → equals. Unary operations (√, x²) execute immediately on the current value. The `%` button works as a binary operation (e.g., 200 % 10 = 20).

### Backend

5. **CORS:** The backend allows `*` origin for development convenience. In production, this should be restricted to the frontend domain.

6. **Error handling:** Validation and domain errors (e.g., division by zero, negative square root) return HTTP 400 with a JSON `error` field. The frontend displays these messages in the calculator display.

### Assumptions

7. **Numeric precision:** Results are returned as floats. The frontend rounds to 10 decimal places for display to avoid floating-point artifacts.

8. **Port usage:** Backend uses 8080, frontend uses 5173 (dev) or 80 (Docker). Ensure these ports are available.

9. **Docker deployment:** When using Docker, the frontend (nginx) proxies `/api` to the backend container. Users access only the frontend URL; API calls are transparent.

---

## Project Structure

```
sezzle/
├── backend/              # Go REST API
│   ├── main.go
│   ├── handlers/
│   └── calculator/
├── frontend/             # React + TypeScript (Vite)
│   └── src/
├── docker-compose.yml
└── README.md
```

---

## License

MIT
