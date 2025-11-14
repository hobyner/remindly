<?php

namespace App\Http\Controllers;

use App\Services\Payments\PaystackService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private PaystackService $paystack)
    {
    }

    public function initialize(Request $request): JsonResponse
    {
        $data = $request->validate([
            'amount' => ['required', 'integer', 'min:1000'],
            'plan' => ['required', 'string'],
        ]);

        $authorization = $this->paystack->initialize($request->user(), $data['amount'], $data['plan']);

        return response()->json($authorization);
    }

    public function webhook(Request $request): JsonResponse
    {
        $this->paystack->verifySignature($request->getContent(), $request->header('x-paystack-signature'));
        $this->paystack->handleWebhook($request->all());

        return response()->json(['status' => 'ok']);
    }
}
