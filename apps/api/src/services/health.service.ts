import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  checkTerminus() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 1000 * 1024 * 1024),
      () => this.memory.checkRSS('memory_RSS', 1000 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk_health', {
          thresholdPercent: 10,
          path: '/',
        }),
    ]);
  }
}
