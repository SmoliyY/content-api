const { Node } = require("../single-linked-list/sll");

class Stack {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  push(value) {
    const newNode = new Node(value);
    if (!this.size) {
      this.first = newNode;
      this.last = newNode;
    } else {
      const tmpNode = this.first;
      this.first = newNode;
      this.first.next = tmpNode;
    }
    this.size += 1;
    return this.size;
  }

  pop() {
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

const stack = new Stack();

console.log(stack.push(22));
console.log(stack.push(1));
console.log(stack.push(5));
console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());

console.log('stack')

// by by duck4
