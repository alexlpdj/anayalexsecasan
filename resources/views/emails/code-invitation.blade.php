@extends('emails.layout')

@section('title', __('emails.subject_invitation'))

@section('header_subtitle', 'Os esperamos el 20 de junio')

@section('content')
    <p style="margin:0 0 20px; color:#5c4a37; font-family:Georgia,serif; font-size:16px; line-height:1.7;">
        {!! __('emails.greeting') !!}
    </p>

    <p style="margin:0 0 24px; color:#5c4a37; font-family:Georgia,serif; font-size:16px; line-height:1.7;">
        {!! __('emails.invitation_intro') !!}
    </p>

    <!-- Code block -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
        <tr>
            <td align="center">
                <p style="margin:0 0 10px; color:#8b7355; font-family:Arial,sans-serif; font-size:13px;
                          letter-spacing:2px; text-transform:uppercase; font-weight:600;">
                    {!! __('emails.your_code') !!}
                </p>
                <div style="display:inline-block; background-color:#faf8f5; border:2px solid #d4c5b9;
                            border-radius:6px; padding:18px 32px;">
                    <span style="font-family:'Courier New',monospace; font-size:36px; font-weight:700;
                                 color:#8b7355; letter-spacing:12px; display:block;">
                        {{ $group->code }}
                    </span>
                </div>
            </td>
        </tr>
    </table>

    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 28px;">
        <tr>
            <td align="center">
                <a href="{{ url('/invitacion/login') }}"
                   style="display:inline-block; background-color:#8b7355; color:#ffffff;
                          font-family:Arial,sans-serif; font-size:15px; font-weight:600;
                          text-decoration:none; padding:14px 36px; border-radius:6px;
                          letter-spacing:1px;">
                    {!! __('emails.cta_access') !!}
                </a>
            </td>
        </tr>
    </table>

    <p style="margin:0; color:#a89584; font-family:Arial,sans-serif; font-size:13px; line-height:1.6; text-align:center;">
        Si el botón no funciona, visita
        <a href="{{ url('/invitacion/login') }}" style="color:#8b7355; text-decoration:underline;">
            {{ url('/invitacion/login') }}
        </a>
        e introduce el código manualmente.
    </p>
@endsection
