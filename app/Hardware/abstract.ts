export interface HardwareInterface {
  on(pin: string): void;
  off(pin: string): void;
}
