class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }

    set next(node) {
        if(node instanceof Node) {
            this.next = node;
        }
        throw "given node is not of type NODE";
    }

    get next() {
        return this.next;
    }
}


/**
 * Creates a priority queue based on the comparator function given.
 * the unique_id parameter given refers to the attribute of the value that acts as a unique id
 * 
 * comparator needs to take two values (a, b), and return:
 * -1 if (a < b)
 * 0 if (a == b)
 * 1 if (a > b)
 */

class PriorityQueue {
    constructor(comparator, unique_id) {
        
        if(!comparator || !unique_id || !(typeof comparator == "function") || !(typeof unique_id == "string")) {
            throw "PriorityQueue constructor requires parameters (function, string)";
        }

        this.head = new Node();
        this.id = unique_id;
        this.comparator = comparator;

    }

    enqueue(value) {
        let new_node = new Node(value);

        let node = this.head;

        while(node.next) {
            if(comparator(node.next.value, value) <= 0) {
                new_node.next = node.next;
                node.next = new_node;
                return;
            }
        }

        new_node.next = node.next;
        node.next = new_node;
    }

    dequeue() {
        const top = this.head.next;
        this.head.next = top.next;

        return top.value;
    }

    update(id, value) {
        let node = this.head.next;

        while(node) {
            if(node.value[this.id] === id) {
                node.value = value;
                return;
            }
            node = node.next;
        }
    }

    delete(id) {
        let node = this.head.next;
        
        if(node.value[this.id] === id) {
            this.head.next = node.next;
            return;
        }
        
        while(node.next) {
            if(node.next.value[this.id] === id) {
                node.next = node.next.next;
                return;
            }
            node = node.next;
        }
    }

    peek() {
        return this.head.next.value;
    }
}