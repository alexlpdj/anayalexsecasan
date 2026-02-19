@extends('emails.layout')

@section('title', "Nueva pregunta de {$groupName}")

@section('header_subtitle', 'Nueva pregunta de invitados')

@section('content')
    <h2 style="margin:0 0 8px; color:#8b7355; font-family:'Playfair Display',Georgia,serif; font-size:18px; font-weight:700;">
        Pregunta de: {{ $groupName }}
    </h2>

    <div style="background-color:#faf8f5; border-left:4px solid #8b7355; padding:16px 20px;
                margin:16px 0; border-radius:4px;">
        <p style="color:#5c4a37; margin:0; font-family:Georgia,serif; font-size:15px; line-height:1.6;">
            {{ $question }}
        </p>
    </div>

    <p style="margin:24px 0 0; color:#a89584; font-family:Arial,sans-serif; font-size:13px;">
        <a href="{{ url('/admin/questions') }}"
           style="color:#8b7355; text-decoration:underline;">
            Ver todas las preguntas en el panel admin
        </a>
    </p>
@endsection
