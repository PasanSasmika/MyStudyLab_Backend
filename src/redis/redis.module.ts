import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('REDIS_URL');
        if (!url) {
          throw new Error('REDIS_URL environment variable is required');
        }

        const redis = new Redis(url, {
          family: 4, 
          retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
          },
          connectTimeout: 10000,
        });
        redis.on('connect', () => console.log('✅ Redis Connected Successfully'));
        redis.on('error', (err) => {
          if (err.message.includes('ECONNRESET')) {
            console.warn('⚠️ Redis Connection Flapping (Retrying...)');
          } else {
            console.error('❌ Redis Error', err.message);
          }
        });

        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}