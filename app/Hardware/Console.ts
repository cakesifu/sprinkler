import { HardwareInterface } from './abstract';

export class ConsoleInterface implements HardwareInterface {
  on(pin: string) {
    console.log('opening :', pin);
  }

  off(pin: string) {
    console.log('closing :', pin);
  }
}
