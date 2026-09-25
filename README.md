# Calculator
odin
# JavaScript Calculator

A basic browser calculator built with vanilla HTML, CSS, and JavaScript. Supports chained operations, decimal input, backspace, and keyboard controls.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- **Sequential evaluation**: only ever evaluates one pair of numbers at a time, matching standard calculator behavior (e.g. `12 + 7 - 1 =` → `19` then `18`, not full expression parsing)
- Chained operators: pressing a new operator immediately evaluates the pending calculation using the previous result
- Operator overwrite: pressing multiple operators in a row without entering a number keeps only the last one pressed
- Decimal point protection: prevents entering more than one `.` per number
- Division by zero returns `"Error"` instead of `Infinity`/`NaN`
- All-clear (`AC`) resets the display and internal state
- Backspace support (deletes the last character)
- Full keyboard support (digits, `+ - * /`, `.`, `Enter`/`=`, `Backspace`)

## How It Works

The calculator keeps track of state in three variables rather than re-parsing the display text on every action:

- `firstOperand` — the number to use in the next calculation
- `currentOperator` — the operator waiting to be applied
- `shouldResetDisplay` — flags whether the next digit typed should start a new number or append to the current one

### Core logic (`handleOperator`)

Whenever an operator (or `=`) is pressed:

1. If there's already a pending operator **and** a new number has been typed since the last operator press, evaluate `firstOperand [currentOperator] inputValue` and show the result.
2. Otherwise (first operator being set, or operators pressed back-to-back with no new digit), just store the current display value as `firstOperand`.
3. Store the new operator (or clear it, if `=` was pressed) and flag that the next digit should start fresh.

This is what allows `12 + 7 - 1 =` to correctly produce `19` and then `18`, and allows mashing multiple operators in a row to silently keep only the last one.

### Pure calculation (`operate`)

`operate(a, operator, b)` takes three already-known values and returns a result — it does **not** parse the display string. All string-to-number parsing happens once, in `handleOperator`, via `parseFloat(display.textContent)`.

## File Structure

```
├── index.html   # Markup and button layout
├── style.css    # Styling
└── script.js    # Calculator logic (this file)
```

## Usage

Open `index.html` in a browser. Click buttons or use the keyboard:

| Key(s)         | Action              |
|----------------|---------------------|
| `0`–`9`        | Enter digit         |
| `+ - * /`      | Select operator     |
| `.`            | Decimal point        |
| `Enter` / `=`  | Evaluate            |
| `Backspace`    | Delete last character |
| `AC` (button)  | Clear everything    |

## Known Limitations

- No support for parentheses or operator precedence (by design — this is a single-pair-at-a-time calculator, not a full expression evaluator)
- No percentage or memory (`M+`/`M-`) functions
- Display does not add thousand separators or truncate long decimals
