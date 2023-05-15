import { Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [],
  imports: [UsersModule],
  providers: [MainGateway],
  exports: [MainGateway],
})
export class SocketModule {}
