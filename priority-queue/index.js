const Node = require('./Node');

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
        
        if( !comparator || 
            !unique_id || 
            !(typeof comparator == 'function') || 
            !(typeof unique_id == 'string')) {
            throw 'PriorityQueue constructor requires parameters (function, string)';
        }

        this.head = new Node();
        this.id = unique_id;
        this.comparator = comparator;
    }

    enqueue(value) {
        let new_node = new Node(value);

        let node = this.head;

        while(node.next) {
            if(this.comparator(node.next.value, value) > 0) {
                new_node.next = node.next;
                node.next  = new_node;
                return;
            }
            node = node.next;
        }

        node.next = new_node;
    }

    dequeue() {
        if(!this.head.next) {
            return null;
        }
        const top = this.head.next;
        this.head.next = top.next;

        return top.value;
    }

    update(value) {
        let node = this.head;

        //remove node;
        while(node.next) {
            if(node.next.value[this.id] === value[this.id]) {
                node.next = node.next.next;  
                break;
            }
            node = node.next;
        }

        //reinsert it into the queue
        this.enqueue(value);
    }

    delete(id) {
        let node = this.head;
        
        while(node.next) {
            if(node.next.value[this.id] === id) {
                node.next = node.next.next;
                return;
            }
            node = node.next;
        }
    }

    peek() {
        if(!this.head.next) {
            return null;
        }
        return this.head.next.value;
    }
}


/**
 * A function that creates a new notification handler
 */
module.exports = function createPriorityQueue(comparator, unique_id) {
    return new PriorityQueue(comparator, unique_id);
};
