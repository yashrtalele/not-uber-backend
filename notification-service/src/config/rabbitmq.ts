import amqp, { Channel, Connection } from "amqplib";
import dotenv from "dotenv";

dotenv.config();

class RabbitMQ {
  private connection!: Connection;
  private channel!: Channel;
  private connected: boolean = false;
  private RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

  public async connect(): Promise<void> {
    if (this.connected && this.channel) {
      return;
    } else {
      this.connected = true;
    }

    try {
      console.log(`⌛️ Connecting to RabbitMQ Server`);
      this.connection = await amqp.connect(this.RABBITMQ_URL);
      console.log(`✅ Rabbit MQ Connection is ready`);
      this.channel = await this.connection.createChannel();
      console.log(`🛸 Created RabbitMQ Channel successfully`);
    } catch (error) {
      console.error(`❌ RabbitMQ connection error: ${(error as Error).message}`);
      throw error;
    }
  }

  public async subscribe(queue: string, callback: any): Promise<void> {
    try {
      if (!this.channel) await this.connect();
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.consume(queue, (message: any) => {
        callback(message.content.toString());
        this.channel.ack(message);
      });
    } catch (error) {
      console.log(`❌ Error while subscribing to the queue: ${(error as Error).message}`);
      throw error;
    }
  }

  public async publish(queue: string, data: any): Promise<void> {
    try {
      if (!this.channel) await this.connect();
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
        persistent: true,
      });
    } catch (error) {
      console.log(`❌ Error while publishing to the queue: ${(error as Error).message}`);
      throw error;
    }
  }
}

const mqConnection = new RabbitMQ();

export default mqConnection;
