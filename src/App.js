import "./App.css";
import "./style.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
//import reactInt1from 'react'

export const ACTIONS = {
  ADD_DIGIT: "digit_addition",
  CLEAR: "clear",
  CHOOSE_OPERATION: "operation",
  DELETE_DIGIT: "digit_delete",
  EQUAL: "answer",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWrite) {
        return { ...state, currentOperand: payload.digit, overWrite: false };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousoperand == null) {
        return state;
      }
      if (state.currentOperand === null)
        return {
          ...state,
          operation: payload.operation,
        };
      if (state.previousoperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousoperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousoperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EQUAL:
      if (
        state.currentOperand == null ||
        state.previousoperand == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        overWrite: true,
        currentOperand: evaluate(state),
        previousoperand: null,
        operation: null,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overWrite) return {};
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}
function evaluate({ currentOperand, previousoperand, operation }) {
  const prev = parseFloat(previousoperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
  }
  return computation.toString();
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatInteger(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}
function App() {
  const [{ currentOperand, previousoperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  //dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } });
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatInteger(previousoperand)}
          {operation}
        </div>
        <div className="current-operand">{formatInteger(currentOperand)}</div>
      </div>
      <button
        className="span-2"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation={"/"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperationButton operation={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <button
        className="span-2"
        onClick={() => dispatch({ type: ACTIONS.EQUAL })}
      >
        =
      </button>
    </div>
  );
}

export default App;
