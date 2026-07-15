<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // A opção precisa pertencer a ESTA enquete. Sem o filtro por poll_id,
            // um option_id de outra enquete seria aceito e gravaria um voto órfão,
            // que jamais apareceria na contagem de resultados.
            'option_id' => [
                'required',
                Rule::exists('options', 'id')->where('poll_id', $this->route('poll')->id),
            ],
            // Identifica o visitante não logado em enquetes anônimas.
            'voter_token' => ['nullable', 'string', 'max:64'],
        ];
    }

    public function messages(): array
    {
        return [
            'option_id.exists' => 'Esta opção não pertence à enquete.',
        ];
    }
}
