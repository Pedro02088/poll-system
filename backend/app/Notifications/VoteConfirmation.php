<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VoteConfirmation extends Notification implements ShouldQueue
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
            ->subject('Voto confirmado')
            ->greeting('Olá!')
            ->line("Você votou na enquete \"{$this->pollTitle}\".")
            ->line('Obrigado por participar no Enlace.');
    }
}
