@extends('emails.layout')

@section('title', $emailSubject)

@section('header_subtitle', 'Un mensaje de Ana &amp; Alex')

@section('content')
    <p style="margin:0 0 20px; color:#5c4a37; font-family:Georgia,serif; font-size:16px; line-height:1.7;">
        {!! nl2br(e($message)) !!}
    </p>
@endsection
