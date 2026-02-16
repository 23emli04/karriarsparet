export interface EducationProvider {
    id: number;
    identifier: string;

    nameSwe: string;
    nameEng: string;

    responsibleBody: string;
    bodyType: string;

    email: string | null;
    phone: string | null;

    townContact: string | null;
    streetContact: string | null;
    postCodeContact: string | null;

    townVisit: string | null;
    streetVisit: string | null;
    postCodeVisit: string | null;

    url: string | null;

    expires: string;       // ISO date string
    lastEdited: string;    // ISO date string
}