export function reachGoal(goal: string, counterId = 102501372, attempt = 0) {
  if (typeof window !== "undefined") {
    if (typeof (window as any).ym === "function") {
      (window as any).ym(counterId, "reachGoal", goal);
    } else if (attempt < 10) {
      setTimeout(() => reachGoal(goal, counterId, attempt + 1), 200);
    }
  }
} 