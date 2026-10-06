import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Memastikan API hidup. Tidak memerlukan autentikasi.',
  })
  @ApiResponse({
    status: 200,
    description: 'API sehat',
    schema: {
      example: { status: 'ok', timestamp: '2026-10-06T15:00:00.000Z' },
    },
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
