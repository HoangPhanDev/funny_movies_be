import { SchedulerRegistry } from '@nestjs/schedule';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MainGateway implements OnGatewayConnection {
  constructor(
    private readonly userService: UsersService,
    private scheduleRegistry: SchedulerRegistry,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    // disconnect socket if after 5s not verified user
    const disconnectTimeout = setTimeout(async () => {
      socket.disconnect();
    }, 5 * 1000);

    this.scheduleRegistry.addTimeout(socket.id, disconnectTimeout);

    socket.on('auth', async (data, ack) => {
      try {
        const user = await this.userService.findById(data.id);
        if (!user) {
          socket.disconnect();
        }
        ack && ack(user);
        socket.join([user.id]);
        this.scheduleRegistry.deleteTimeout(socket.id);
      } catch {
        socket.disconnect();
      }
    });
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
