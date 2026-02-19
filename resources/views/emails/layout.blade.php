<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title', 'Ana & Alex — 20 de junio de 2026')</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; }
            .email-header, .email-body, .email-footer { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f1ed; font-family:Georgia,'Times New Roman',serif; -webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f1ed; padding:40px 20px;">
    <tr>
        <td align="center">

            <!-- Container -->
            <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 16px rgba(139,115,85,0.10);">

                <!-- Header -->
                <tr>
                    <td class="email-header"
                        style="background:linear-gradient(135deg,#8b7355,#a89584); padding:36px 40px; text-align:center;">
                        <h1 style="margin:0; color:#ffffff; font-family:'Playfair Display',Georgia,serif; font-style:italic;
                                   font-size:42px; font-weight:400; letter-spacing:4px; line-height:1.1;">
                            A &amp; A
                        </h1>
                        <p style="margin:10px 0 0; color:#d4c5b9; font-family:Georgia,serif; font-size:14px;
                                  letter-spacing:2px; text-transform:uppercase; font-style:normal;">
                            @yield('header_subtitle', 'Ana &amp; Alex · 20 de junio de 2026')
                        </p>
                    </td>
                </tr>

                <!-- Ornamental divider -->
                <tr>
                    <td style="padding:20px 40px 0; text-align:center;">
                        <p style="margin:0; color:#d4c5b9; font-size:16px; letter-spacing:8px;">— ✦ —</p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td class="email-body" style="padding:24px 40px 32px;">
                        @yield('content')
                    </td>
                </tr>

                <!-- Ornamental divider before footer -->
                <tr>
                    <td style="padding:0 40px; text-align:center;">
                        <p style="margin:0; color:#d4c5b9; font-size:16px; letter-spacing:8px;">— ✦ —</p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td class="email-footer" style="padding:20px 40px 32px; text-align:center;">
                        <p style="margin:0; color:#a89584; font-family:'Playfair Display',Georgia,serif;
                                  font-style:italic; font-size:16px;">
                            Con todo nuestro amor,
                        </p>
                        <p style="margin:6px 0 0; color:#8b7355; font-family:'Playfair Display',Georgia,serif;
                                  font-style:italic; font-size:20px; font-weight:700; letter-spacing:2px;">
                            Ana &amp; Alex
                        </p>
                        <p style="margin:16px 0 0; color:#c4b5a6; font-family:Arial,sans-serif; font-size:11px;
                                  line-height:1.6;">
                            &copy; {{ date('Y') }} &nbsp;·&nbsp; anayalexsecasan.es<br>
                            Recibes este email porque estás invitado/a a nuestra boda.<br>
                            Si crees que lo has recibido por error, ignóralo.
                        </p>
                    </td>
                </tr>

            </table>
            <!-- /Container -->

        </td>
    </tr>
</table>

</body>
</html>
