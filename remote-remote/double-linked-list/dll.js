class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

// comment 2
 
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(value) {
    const newNode = new Node(value);
    if (!this.length) {
      this.tail = newNode;
      this.head = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this.length += 1;

    return this;
  }

  pop() {
    if (!this.length) return;

    const oldTail = this.tail;

    if (this.length === 1) {
      this.tail = null;
      this.head = null;
    } else {
      this.tail = oldTail.prev;
      this.tail.next = null;
      oldTail.prev = null;
    }
    this.length -= 1;
    return oldTail;
  }

  shift() {
    if (!this.length) return;

    const oldHead = this.head;

    if (this.length === 1) {
      this.tail = null;
      this.head = null;
    } else {
      this.head = oldHead.next;
      this.head.prev = null;
      oldHead.next = null;
    }
    this.length -= 1;
    return oldHead;
  }

  unshift(value) {
    const newNode = new Node(value);
    if (!this.length) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.length += 1;
    return this;
  }

  get(index) {
    if (index < 0 || index >= this.length) return null;

    if (index === 0) {
      return this.head;
    }

    let counter = 0;

    if (Math.floor(this.length / 2) > index) {
      let currentNode = this.head;
      while (counter !== index) {
        currentNode = currentNode.next;
        counter += 1;
      }
      return currentNode;
    } else {
      counter = this.length - 1;
      let currentNode = this.tail;
      while (counter !== index) {
        currentNode = currentNode.prev;
        counter -= 1;
      }
      return currentNode;
    }
  }

  set(index, value) {
    const node = this.get(index);
    if (!node) return false;
    node.value = value;
    return true;
  }

  insert(index, value) {
    if (index < 0 || index >= this.length) return false;

    if (!this.length) return false;

    if (index === 0) return !!this.unshift(value);

    if (index === this.length) return !!this.push(value);

    const beforeNode = this.get(index - 1);
    const afterNode = beforeNode.next;

    const newNode = new Node(value);

    newNode.next = afterNode;
    newNode.prev = beforeNode;

    afterNode.prev = newNode;
    beforeNode.next = newNode;

    this.length += 1;

    return true;
  }

  remove(index) {
    if (index < 0 || index >= this.length) return;
    if (index === 0) return this.shift();
    if (index === this.length-1) return this.pop(value);

    const nodeToRemove = this.get(index);
    const beforeNodeToRemove = nodeToRemove.prev;
    const afterNodeToRemove = nodeToRemove.next;

    beforeNodeToRemove.next = afterNodeToRemove;
    afterNodeToRemove.prev = beforeNodeToRemove;

    nodeToRemove.next = null;
    nodeToRemove.prev = null;

    this.length-=1;

    return nodeToRemove;
  }
}

list = new DoublyLinkedList();

list.push(33);
list.push(55);
list.push(100)
list.insert(2, 44);
// list.remove(0)

console.log(list.remove(2));

console.log(list)
