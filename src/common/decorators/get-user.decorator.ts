import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return undefined;
    }

    // Si se especifica una propiedad, retornarla
    // Ej: @GetUser('userId') -> retorna user.userId
    // Ej: @GetUser('email') -> retorna user.email
    // Ej: @GetUser() -> retorna todo el objeto user
    return data ? user[data] : user;
  },
);

