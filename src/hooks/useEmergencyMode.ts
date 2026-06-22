import { useCallback } from "react";
import type { IntakeState } from "../types/intake";

export function useEmergencyMode(
  intake: IntakeState,
  setIntake: React.Dispatch<React.SetStateAction<IntakeState>>,
) {
  const toggleEmergencyMode = useCallback(() => {
    setIntake((prev) => ({
      ...prev,
      emergencyMode: !prev.emergencyMode,
    }));
  }, [setIntake]);

  return {
    emergencyMode: intake.emergencyMode,
    toggleEmergencyMode,
  };
}
