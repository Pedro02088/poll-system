<?php

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Illuminate\Session\Middleware\StartSession::class,
        ]);

        // Railway/Vercel terminam o TLS num proxy. Sem confiar nele, o Laravel
        // enxerga a requisição como http e não envia o cookie de sessão marcado
        // como Secure (necessário para SameSite=None cross-domain).
        $middleware->trustProxies(at: '*');
    })
->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Illuminate\Auth\AuthenticationException $e, Request $request) {
            return response()->json(['message' => 'Não autenticado'], 401);
        });

        // O 404 padrão do route model binding devolve
        // "No query results for model [App\Models\Poll] 999999", expondo o
        // namespace interno. Aqui a resposta vira uma mensagem limpa em português.
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $anterior = $e->getPrevious();

            if ($anterior instanceof ModelNotFoundException) {
                $mensagens = [
                    'Poll' => 'Enquete não encontrada.',
                    'Option' => 'Opção não encontrada.',
                    'User' => 'Usuário não encontrado.',
                    'Vote' => 'Voto não encontrado.',
                ];

                return response()->json([
                    'message' => $mensagens[class_basename($anterior->getModel())] ?? 'Registro não encontrado.',
                ], 404);
            }

            return response()->json(['message' => 'Rota não encontrada.'], 404);
        });

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();