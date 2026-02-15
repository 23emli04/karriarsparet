export interface Education {
    id: string;
    code: string;
    titles: Title[];
    descriptions: Description[];
    educationLevel: {
        code: string;
        type: string;
    };
    form: {
        code: string;
        type: string;
    };
    executions: Execution[];
    languagesOfInstruction: string[];
    paceOfStudyPercentages: number[];
    subjects: Subject[];
    resultIsDegree: boolean;
    credits?: number | null;
    eligibility?: {
        eligibilityDescription: string;
    };
}

export interface Title {
    lang: string;
    content: string;
}

export interface Description {
    lang: string;
    content: string;
}

export interface Execution {
    start: string;
    end: string;
}

export interface Subject {
    code: string;
    name: string;
    type: string;
}