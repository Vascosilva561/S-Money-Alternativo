
import './index.css'
import React from 'react';
import ReactDOM from "react-dom/client";
import { Routers } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/auth'
import "../src/api/interceptor";
import { FormNormalizer } from "./components/ui/form-normalizer";


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
        <QueryClientProvider client={queryClient}>
                <AuthProvider>
                        <FormNormalizer />
                        <Routers />
                </AuthProvider>
        </QueryClientProvider>
);
