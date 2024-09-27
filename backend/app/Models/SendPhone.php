<?php

namespace App\Models;

use Twilio\Rest\Client;

class SendPhone
{
    public static function sendSms($phoneNumber, $verificationCode)
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $twilioNumber = config('services.twilio.number');

        $client = new Client($sid, $token);
        $client->messages->create(
            $phoneNumber,
            [
                'from' => $twilioNumber,
                'body' => 'Mã xác nhận của bạn là: ' . $verificationCode,
            ]
        );
    }
}
