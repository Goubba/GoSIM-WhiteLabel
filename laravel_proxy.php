<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProxyController extends Controller
{
    // The target base URL for the external API
    private string $targetBaseUrl = 'https://business.getgosim.com/api/v1/vendor';

    /**
     * Helper function to forward incoming requests to the target API.
     */
    private function forwardRequest(Request $request)
    {
        // 1. Build the target URL using the incoming request path
        // $request->getRequestUri() includes the path and the query string (e.g., /locations?search=usa)
        $targetUrl = $this->targetBaseUrl . $request->getRequestUri();

        // 2. Prepare the headers, excluding host/origin info just like the Node script
        $headers = collect($request->headers->all())
            ->map(fn($value) => $value[0]) // Laravel headers are arrays, flatten them
            ->except(['host', 'origin', 'referer'])
            ->toArray();

        // 3. Inject the API Key from the .env file if it exists
        if (env('API_KEY')) {
            $headers['api-key'] = env('API_KEY');
        }

        try {
            // 4. Send the request using Laravel's HTTP Client
            $response = Http::withHeaders($headers)
                ->send($request->method(), $targetUrl, [
                    'json' => $request->isJson() ? $request->json()->all() : $request->all()
                ]);

            // You can alter $response->json() here before returning
            return response()->json($response->json(), $response->status());

        } catch (\Exception $e) {
            // Handle request or connection failures
            return response()->json([
                'error' => 'Proxy Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // 1. Get Payment Order Status
    public function getPaymentStatus(Request $request, $paymentId)
    {
        // Add custom logic here if needed
        return $this->forwardRequest($request);
    }

    // 2. Get Locations (with optional search)
    public function getLocations(Request $request)
    {
        return $this->forwardRequest($request);
    }

    // 3. Initiate External Unauth Order
    public function initiateUnauthOrder(Request $request)
    {
        return $this->forwardRequest($request);
    }

    // 4. Get Packages
    public function getPackages(Request $request)
    {
        return $this->forwardRequest($request);
    }
}
