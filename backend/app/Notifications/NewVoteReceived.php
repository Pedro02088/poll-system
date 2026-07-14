<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewVoteReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $pollTitle) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Sua enquete recebeu um novo voto')
            ->greeting('Boas notícias!')
            ->line("Sua enquete \"{$this->pollTitle}\" recebeu um novo voto.")
            ->line('Acesse o Enlace para ver os resultados.');
    }
}
