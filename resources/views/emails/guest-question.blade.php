<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
</head>
<body style="margin:0; padding:0; background-color:#f5f1ed; font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ed; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#8b7355; padding:24px; text-align:center;">
                            <h1 style="color:#ffffff; margin:0; font-size:24px;">A & A</h1>
                            <p style="color:#d4c5b9; margin:4px 0 0; font-size:14px;">Nueva pregunta de invitados</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h2 style="color:#8b7355; margin:0 0 8px; font-size:18px;">Pregunta de: {{ $groupName }}</h2>
                            <div style="background-color:#faf8f5; border-left:4px solid #8b7355; padding:16px; margin:16px 0; border-radius:4px;">
                                <p style="color:#333; margin:0; font-size:15px; line-height:1.6;">{{ $question }}</p>
                            </div>
                            <p style="color:#a89584; font-size:13px; margin-top:24px;">
                                <a href="{{ url('/admin/questions') }}" style="color:#8b7355; text-decoration:underline;">Ver todas las preguntas en el panel admin</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
