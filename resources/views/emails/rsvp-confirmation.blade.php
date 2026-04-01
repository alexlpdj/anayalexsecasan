@extends('emails.layout')

@section('title', $attending ? __('emails.subject_confirmation') : __('emails.subject_confirmation_decline'))

@section('header_subtitle', $attending ? '¡Nos vemos el 20 de junio!' : 'Ana & Alex · 20 de junio de 2026')

@section('content')
    @if($attending)
        <h2 style="margin:0 0 16px; color:#8b7355; font-family:'Playfair Display',Georgia,serif;
                   font-size:22px; font-weight:700; text-align:center;">
            {!! __('emails.confirmation_attending_title') !!}
        </h2>

        <p style="margin:0 0 24px; color:#5c4a37; font-family:Georgia,serif; font-size:16px; line-height:1.7;">
            {!! __('emails.confirmation_attending_body') !!}
        </p>

        {{-- Attending guests list --}}
        @if($group->guests->where('attending', true)->count() > 0)
        <div style="background-color:#faf8f5; border:1px solid #e8ddd4; border-radius:6px; padding:20px; margin:20px 0;">
            <p style="margin:0 0 12px; color:#8b7355; font-family:Arial,sans-serif; font-size:13px;
                      letter-spacing:2px; text-transform:uppercase; font-weight:600;">
                {!! __('emails.guests_attending') !!}
            </p>
            @foreach($group->guests->where('attending', true) as $guest)
            <div style="padding:8px 0; border-bottom:1px solid #ede6de; display:flex; align-items:center;">
                <span style="color:#5c4a37; font-family:Georgia,serif; font-size:15px;">
                    ✓ &nbsp; {{ $guest->name }}
                </span>
                @if($guest->allergies)
                <span style="margin-left:8px; color:#a89584; font-family:Arial,sans-serif; font-size:12px;">
                    ({{ $guest->allergies }})
                </span>
                @endif
            </div>
            @endforeach
        </div>
        @endif

        {{-- Transport summary --}}
        @if($group->transport && $group->transport !== 'NO_CONFIRMADO')
        <div style="background-color:#f0ede8; border-radius:6px; padding:16px 20px; margin:20px 0;">
            <p style="margin:0 0 6px; color:#8b7355; font-family:Arial,sans-serif; font-size:13px;
                      letter-spacing:2px; text-transform:uppercase; font-weight:600;">
                {!! __('emails.transport_title') !!}
            </p>
            @if($group->transport === 'AUTOBUS')
                <p style="margin:0; color:#5c4a37; font-family:Georgia,serif; font-size:15px;">
                    🚌 {!! __('emails.transport_bus') !!}
                </p>
                @if($group->bus_onda_ida)
                <p style="margin:4px 0 0; color:#5c4a37; font-family:Arial,sans-serif; font-size:13px;">
                    &nbsp;&nbsp;· {!! __('emails.bus_onda_ida') !!}
                </p>
                @endif
                @if($group->bus_onda_vuelta)
                <p style="margin:4px 0 0; color:#5c4a37; font-family:Arial,sans-serif; font-size:13px;">
                    &nbsp;&nbsp;· {!! __('emails.bus_onda_vuelta') !!}
                </p>
                @endif
                @if($group->bus_cs)
                <p style="margin:4px 0 0; color:#5c4a37; font-family:Arial,sans-serif; font-size:13px;">
                    &nbsp;&nbsp;· {!! __('emails.bus_cs') !!}
                </p>
                @endif
            @elseif($group->transport === 'COCHE')
                <p style="margin:0; color:#5c4a37; font-family:Georgia,serif; font-size:15px;">
                    🚗 {!! __('emails.transport_car') !!}
                </p>
            @endif
        </div>
        @endif

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px;">
            <tr>
                <td align="center">
                    <a href="{{ url('/invitacion/dashboard') }}"
                       style="display:inline-block; background-color:#8b7355; color:#ffffff;
                              font-family:Arial,sans-serif; font-size:15px; font-weight:600;
                              text-decoration:none; padding:14px 36px; border-radius:6px;
                              letter-spacing:1px;">
                        {!! __('emails.cta_view') !!}
                    </a>
                </td>
            </tr>
        </table>

    @else
        <h2 style="margin:0 0 16px; color:#8b7355; font-family:'Playfair Display',Georgia,serif;
                   font-size:22px; font-weight:700; text-align:center;">
            {!! __('emails.confirmation_decline_title') !!}
        </h2>

        <p style="margin:0; color:#5c4a37; font-family:Georgia,serif; font-size:16px; line-height:1.7; text-align:center;">
            {!! __('emails.confirmation_decline_body') !!}
        </p>
    @endif
@endsection
