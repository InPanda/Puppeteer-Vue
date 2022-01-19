module.exports = class Queue {
  constructor(items) {
    this.items = items || [];
  }
  // 入列
  enqueue(ele) {
    this.items.push(...ele);
  }
  // 出列
  dequeue() {
    return this.items.shift();
  }
  // 获取队首
  front() {
    return this.items[0];
  }
  // 清空队列
  clear() {
    this.items = [];
  }
  // 获取队列长度
  get size() {
    return this.items.length;
  }
  // 判断是否为空队列
  get isEmpty() {
    return !this.items.length;
  }
  // 打印队列
  print() {
    console.log(this.items.toString());
  }
}
