import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(
            withInterceptors([
                (req, next) => {
                    const clone = req.clone({
                        headers: req.headers.set('x-request-id', 'DevFest'),
                    });
                    return next(clone);
                },
            ])
        ),
        provideRouter(routes),
    ],
};
