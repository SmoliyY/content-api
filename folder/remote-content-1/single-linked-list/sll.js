class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

//22222 comment

class SingleLinkedList {
  constructor() {
    this.tail = null;
    this.head = null;
    this.length = 0;
  }

  push(value) {
    const tmp = new Node(value);
    if (this.length === 0) {
      this.head = tmp;
      this.tail = this.head;
    } else {
      this.tail.next = tmp;
      this.tail = tmp;
    }
    this.length += 1;

    return this;
  }

  pop() {
    if (!this.length) return;

    // If only one value reset sll class and return head/tail
    if (this.length === 1) {
      const valueToReturn = this.head;
      this.head = null;
      this.tail = null;
      this.length = 0;
      return valueToReturn;
    }

    let current = this.head;
    let popValue = this.tail;

    // Loop over nodes while they exist
    while (current !== null) {
      // if node next.next = null means that we find before last node;
      //set next to null and overwrite tail with it
      if (current.next.next === null) {
        current.next = null;
        this.tail = current;
        this.length -= 1;
      }
      current = current.next;
    }

    return popValue;
  }

  shift() {
    if (!this.length) return;
    const valueToReturn = this.head;
    this.head = valueToReturn.next;
    this.length -= 1;

    if (this.length === 0) {
      this.tail = null;
    }
    return valueToReturn;
  }

  unshift(value) {
    const newNode = new Node(value);

    if (!this.length) {
      this.tail = newNode;
      this.head = newNode;
    } else {
      newNode.next = this.head;
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

    let currentNode = this.head;
    let counter = 0;
    while (counter !== index) {
      currentNode = currentNode.next;
      counter += 1;
    }

    return currentNode;
  }

  set(index, value) {
    const nodeToUpdate = this.get(index);
    if (!nodeToUpdate) return false;
    nodeToUpdate.value = value;
    return true;
  }

  insert(index, value) {
    if (index < 0 || index > this.length) return false;

    if (index === 0) return !!this.unshift(value);

    if (index === this.length) return !!this.push(value);

    const preNode = this.get(index - 1);

    const nodeToInsert = new Node(value);

    nodeToInsert.next = preNode.next;
    preNode.next = nodeToInsert;
    this.length += 1;

    return true;
  }

  remove(index) {
    if (index < 0 || index >= this.length) return;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();

    const preNode = this.get(index - 1);

    const nodeToReturn = preNode.next;

    preNode.next = nodeToReturn.next;

    this.length -= 1;

    return nodeToReturn;
  }

  reverse() {
    let node = this.head;
    this.head = this.tail;
    this.tail = node;

    let nextNode;
    let prevNode = null;

    for (let i = 0; i < this.length; i++) {
      nextNode = node.next;
      node.next = prevNode;
      prevNode = node;
      node = nextNode;
    }

    return this;
  }
}

const a = new SingleLinkedList();

a.push(22);
a.push(23);
a.push(4);
a.push(99);


module.exports = {
  Node
}
