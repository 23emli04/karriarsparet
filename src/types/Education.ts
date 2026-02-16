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
    /** From detail API */
    identifier?: string;
    distance?: boolean | null;
    expires?: string | null;
    eligibilityTags?: string[];
    timeOfStudy?: string[];
    municipalityCodes?: string[];
    regionCodes?: string[];
    lastEdited?: string;
    lastSynced?: string;
    enrichedCompetencies?: string[];
    enrichedGeos?: string[];
    enrichedOccupations?: string[];
    tuitionFees?: unknown[];
    urls?: unknown[];
    onlyAsPartOfProgram?: unknown[];
    providers?: unknown[];
    recommendedPriorKnowledge?: unknown[];
    enrichedTraits?: string[];
    isVocational?: boolean | null;
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

