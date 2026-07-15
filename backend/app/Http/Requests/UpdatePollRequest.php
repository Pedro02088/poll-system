<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePollRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * As opções não entram aqui de propósito: as FKs de votes usam
     * ON DELETE CASCADE, então alterar ou remover uma opção apagaria os votos
     * já registrados nela. Só os metadados da enquete são editáveis.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'expires_at' => ['nullable', 'date'],
            'is_anonymous' => ['nullable', 'boolean'],
        ];
    }
}
