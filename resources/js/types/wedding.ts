export interface Guest {
    id: number;
    name: string;
    code: string;
    type: 'FAMILIAR' | 'AMIGO' | 'NOVIOS';
    gender: 'HOMBRE' | 'MUJER' | null;
    confirmed: boolean | null;
    confirmed_at: string | null;
    allergies: string | null;
    transport: 'AUTOBUS' | 'COCHE' | 'NO_CONFIRMADO';
    bus_onda_ida: boolean;
    bus_onda_vuelta: boolean;
    bus_cs: boolean;
    email: string | null;
    phone: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface WeddingInfo {
    bride: string;
    groom: string;
    date: string;
    civil_ceremony_date: string;
    venue: {
        name: string;
        url: string;
        address: string;
        parking: string;
    };
    schedule: Array<{
        time: string;
        event: string;
        description: string;
    }>;
    transport: {
        buses_available: boolean;
        buses_schedule: string;
        parking_available: boolean;
    };
}

export interface AdminStats {
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
    with_allergies: number;
    need_bus: number;
}

export interface TransportSummary {
    bus_onda_ida: number;
    bus_onda_vuelta: number;
    bus_cs: number;
    own_car: number;
}

export interface GuestAllergy {
    name: string;
    allergies: string;
}

export interface RsvpFormData {
    confirmed: boolean;
    allergies: string;
    transport: 'AUTOBUS' | 'COCHE' | 'NO_CONFIRMADO';
    bus_onda_ida: boolean;
    bus_onda_vuelta: boolean;
    bus_cs: boolean;
    email: string;
    phone: string;
}

export interface LoginFormData {
    code: string;
}

export interface PageProps {
    auth?: {
        guest?: Guest;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}
