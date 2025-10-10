//Interface para implementação dos listeners
export interface Observer<T> {
  update(data: T): void;
}

//Subject de implementação para receber os listeners e notifica-los do evento
export class Subject<T> {
  private observers: Observer<T>[] = [];

  attach(observer: Observer<T>) {
    this.observers.push(observer);
  }

  detach(observer: Observer<T>) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data: T) {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}
