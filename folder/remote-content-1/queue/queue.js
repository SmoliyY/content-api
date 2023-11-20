const { Node } = require("../single-linked-list/sll");
// add some changes changes
class Queue {
  constructor() {
    this.last = null;
    this.first = null;
    this.size = 0;
  }

  enqueue(value) {
    const newNode = new Node(value);
    if (!this.size) {
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }
    this.size += 1;
    return this.size;
  }

  dequeue() {
    if (!this.size) return null;
    const tmpNode = this.first;

    if (this.size === 1) {
      this.first = null;
      this.last = null;
    }
    this.first = tmpNode.next;
    this.size -= 1;
    return tmpNode.value;
  }
}

const queue = new Queue();

queue.enqueue(33);
queue.enqueue(22);
queue.enqueue(11);
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());

// console.log(queue)
