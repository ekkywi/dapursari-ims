import { Injectable } from '@nestjs/common';
import { UserRole } from '@dapursari/types';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'Dapursari IMS API',
      status: 'ok',
      roles: Object.values(UserRole),
    };
  }
}
