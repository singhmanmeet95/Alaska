import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleJoinUser, handleGetOnlineUsers, handleSendMessage, handleDisconnect } from '../src/socket/handlers.js';
import { pubClient } from '../src/redis.js';

vi.mock('../src/redis.js', () => ({
  pubClient: {
    sAdd: vi.fn(),
    sMembers: vi.fn(),
    lPush: vi.fn(),
    sRem: vi.fn(),
  },
  subClient: {},
  subscriber: {
    subscribe: vi.fn()
  }
}));

describe('Socket Handlers', () => {
  let mockIo;
  let mockSocket;

  beforeEach(() => {
    mockIo = {
      emit: vi.fn(),
      in: vi.fn().mockReturnThis(),
      fetchSockets: vi.fn().mockResolvedValue([]),
    };
    mockSocket = {
      id: 'socket-1',
      join: vi.fn(),
      emit: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('handleJoinUser should join room and update status', async () => {
    const handler = handleJoinUser(mockIo, mockSocket);
    await handler('user-1');
    expect(mockSocket.join).toHaveBeenCalledWith('user-1');
    expect(pubClient.sAdd).toHaveBeenCalledWith('online_users', 'user-1');
    expect(mockIo.emit).toHaveBeenCalledWith('user_status', { userId: 'user-1', status: 'online' });
  });

  it('handleGetOnlineUsers should return online users', async () => {
    pubClient.sMembers.mockResolvedValue(['user-1', 'user-2']);
    const handler = handleGetOnlineUsers(pubClient);
    const callback = vi.fn();
    await handler(callback);
    expect(callback).toHaveBeenCalledWith(['user-1', 'user-2']);
  });

  it('handleSendMessage should queue message and send ack', async () => {
    const handler = handleSendMessage(mockSocket);
    const data = { senderId: 'user-1', receiverId: 'user-2', message: 'Hello' };
    await handler(data);
    expect(pubClient.lPush).toHaveBeenCalled();
    expect(mockSocket.emit).toHaveBeenCalledWith('message_sent_ack', expect.objectContaining({
      senderId: 'user-1',
      receiverId: 'user-2',
      status: 'queued'
    }));
  });

  it('handleDisconnect should handle user disconnection', async () => {
    mockSocket.userId = 'user-1';
    const handler = handleDisconnect(mockIo, mockSocket);
    await handler();
    expect(pubClient.sRem).toHaveBeenCalledWith('online_users', 'user-1');
    expect(mockIo.emit).toHaveBeenCalledWith('user_status', { userId: 'user-1', status: 'offline' });
  });
});
