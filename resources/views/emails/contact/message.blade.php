<x-mail::message>
# New Contact Form Submission

**Name:** {{ $first_name }} {{ $last_name }}
**Email:** {{ $email }}

**Message:**
{{ $message }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
