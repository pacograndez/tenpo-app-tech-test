import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services';

export const authGuard: CanActivateFn = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.isLogged();

  if (!token) {
    alert('Usted debe de iniciar sesión para ver el contenido de la página!!')
    router.navigate(['/login']);
    return false;
  }

  return true;
};
