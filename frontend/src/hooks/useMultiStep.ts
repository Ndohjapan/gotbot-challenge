import { ReactElement, useState } from "react";

export function useMultiStep(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((prev) => (prev >= steps.length - 1 ? prev : prev + 1));
  }

  function prev() {
    setCurrentStepIndex((prev) => (prev <= 0 ? prev : prev - 1));
  }

  function goto(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    step: steps[currentStepIndex],
    currentStepIndex,
    setCurrentStepIndex,
    goto,
    next,
    prev,
  };
}
