import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services';
import { inject } from '@angular/core';

export const homeGuard: CanActivateFn = (): boolean => {
  const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.isLogged();
  
    if (token) {
      router.navigate(['/home']);
      return false;
    }
  
    return true;
};
