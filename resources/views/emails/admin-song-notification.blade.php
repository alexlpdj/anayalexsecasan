@extends('emails.layout')

@section('title', "Nueva canción sugerida por {$group->name}")

@section('header_subtitle', 'Nueva sugerencia musical')

@section('content')
    <h2 style="margin:0 0 8px; color:#8b7355; font-family:'Playfair Display',Georgia,serif; font-size:18px; font-weight:700;">
        {{ $group->name }} ha sugerido una canción
    </h2>

    <div style="background-color:#faf8f5; border-left:4px solid #8b7355; padding:16px 20px;
                margin:16px 0; border-radius:4px; display:flex; align-items:center; gap:16px;">
        @if($artworkUrl)
            <img src="{{ $artworkUrl }}" alt="Portada" width="64" height="64"
                 style="border-radius:6px; display:block; float:left; margin-right:16px;">
        @endif
        <div style="overflow:hidden;">
            <p style="margin:0 0 4px; color:#5c4a37; font-family:'Playfair Display',Georgia,serif;
                      font-size:16px; font-weight:700;">
                {{ $trackTitle }}
            </p>
            <p style="margin:0; color:#8b7355; font-family:Georgia,serif; font-size:14px;">
                {{ $artistName }}
            </p>
        </div>
        <div style="clear:both;"></div>
    </div>

    <p style="margin:24px 0 0; color:#a89584; font-family:Arial,sans-serif; font-size:13px;">
        <a href="{{ url('/admin/songs') }}"
           style="color:#8b7355; text-decoration:underline;">
            Ver todas las canciones en el panel admin
        </a>
    </p>
@endsection
