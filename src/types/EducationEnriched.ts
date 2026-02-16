import type { Education } from "./Education";
import type { EducationEvent } from "./EducationEvent";
import type { EducationProvider } from "./EducationProvider";

export interface EducationEnriched {
    education: Education;
    educationEvent: EducationEvent;
    educationProvider: EducationProvider;
}
