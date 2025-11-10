
import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// Node's EventEmitter is used here because it's simple and doesn't depend on any specific framework.
// It also works in all environments (node, browser, etc.)
class TypedEventEmitter extends EventEmitter {
  emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>) {
    return super.emit(event, ...args);
  }

  on<T extends keyof Events>(event: T, listener: Events[T]) {
    return super.on(event, listener);
  }
}

export const errorEmitter = new TypedEventEmitter();

    