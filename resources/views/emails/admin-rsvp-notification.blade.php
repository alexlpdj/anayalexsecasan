@extends('emails.layout')

@section('title', ($isUpdate ? '[Modificación] ' : '') . ($attending ? 'Confirmación' : 'Rechazo') . " de {$group->name}")

@section('header_subtitle', $isUpdate ? 'Modificación de RSVP' : 'Nueva respuesta de invitados')

@section('content')
    <h2 style="margin:0 0 8px; color:#8b7355; font-family:'Playfair Display',Georgia,serif; font-size:18px; font-weight:700;">
        @if($isUpdate)
            {{ $group->name }} ha <strong>modificado</strong> su respuesta
        @elseif($attending)
            {{ $group->name }} ha <strong>confirmado</strong> su asistencia
        @else
            {{ $group->name }} ha <strong>rechazado</strong> la invitación
        @endif
    </h2>

    @if($attending)
        {{-- Attending guests --}}
        <div style="background-color:#faf8f5; border-left:4px solid #8b7355; padding:16px 20px; margin:16px 0; border-radius:4px;">
            <p style="margin:0 0 8px; color:#5c4a37; font-family:Arial,sans-serif; font-size:13px; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">
                Asistentes ({{ $group->guests->where('attending', true)->count() }})
            </p>
            @foreach($group->guests->where('attending', true) as $guest)
                <p style="margin:4px 0; color:#5c4a37; font-family:Georgia,serif; font-size:14px;">
                    • {{ $guest->name }}
                    @if($guest->allergies)
                        <span style="color:#a89584; font-size:12px;"> — Alergias: {{ $guest->allergies }}</span>
                    @endif
                </p>
            @endforeach
        </div>

        {{-- Transport --}}
        @if($group->transport && $group->transport !== 'NO_CONFIRMADO')
            <div style="margin:12px 0; padding:12px 16px; background-color:#f0ebe4; border-radius:4px;">
                <p style="margin:0; color:#5c4a37; font-family:Arial,sans-serif; font-size:13px;">
                    <strong>Transporte:</strong>
                    {{ $group->transport === 'AUTOBUS' ? 'Autobús' : 'Coche propio' }}
                    @if($group->transport === 'AUTOBUS')
                        @if($group->bus_onda_ida) · Bus Onda ida @endif
                        @if($group->bus_onda_vuelta) · Bus Onda vuelta @endif
                        @if($group->bus_cs) · Bus Castellón @endif
                    @endif
                </p>
            </div>
        @endif

        {{-- Contact --}}
        @if($group->contact_email || $group->contact_phone)
            <div style="margin:12px 0; padding:12px 16px; background-color:#f0ebe4; border-radius:4px;">
                @if($group->contact_email)
                    <p style="margin:0 0 4px; color:#5c4a37; font-family:Arial,sans-serif; font-size:13px;">
                        <strong>Email:</strong> {{ $group->contact_email }}
                    </p>
                @endif
                @if($group->contact_phone)
                    <p style="margin:0; color:#5c4a37; font-family:Arial,sans-serif; font-size:13px;">
                        <strong>Teléfono:</strong> {{ $group->contact_phone }}
                    </p>
                @endif
            </div>
        @endif
    @else
        <div style="background-color:#faf8f5; border-left:4px solid #c4a882; padding:16px 20px; margin:16px 0; border-radius:4px;">
            <p style="color:#5c4a37; margin:0; font-family:Georgia,serif; font-size:14px; line-height:1.6;">
                El grupo <strong>{{ $group->name }}</strong> no podrá asistir a la boda.
            </p>
        </div>
    @endif

    <p style="margin:24px 0 0; color:#a89584; font-family:Arial,sans-serif; font-size:13px;">
        <a href="{{ url('/admin/guests') }}"
           style="color:#8b7355; text-decoration:underline;">
            Ver todos los invitados en el panel admin
        </a>
    </p>
@endsection
