var createPriorityQueue     = require('../priority-queue');
var Node                    = require('../priority-queue/Node');
var {expect, assert}        = require('chai');

describe('Node', function() {

    describe('# Constructor', function() {
        it('should create an object of type Node', function() {
            const node = new Node("value");
        });
    });

    describe('# Getter and Setter for next', function() {
        it('should set next pointer to Node object', function() {
            const node1 = new Node("value1");
            const node2 = new Node("value2");
    
            node1.next = node2;
            assert(node1.next === node2);
        });
        it('should throw error when next is set to non Node type object', function() {
            const node1 = new Node("value1");
            const node2 = 1;
            expect(() => (node1.next = node2)).to.throw();
        });
    });

    describe('# Getter and Setter for value', function() {
        it('should set value on creation', function() {
            const val = "value"
            const node = new Node(val);
            assert(node.value === val);
        })
        it('should be able to edit value', function() {
            const node1 = new Node("value1");
            const val = "value"

            node1.value = val;
            assert(node1.value === val);
        });
    });
});


describe('PriorityQueue', function() {
    const func = (a, b) => {
        if(a.val < b.val) {
            return -1;
        } else if(a.val > b.val) {
            return 2;
        } else {
            return 0;
        }
    };
    const id = "id";

    describe('# Constructor', function() {
        it('should create an object of type PriorityQueue', function() {
            const pq = createPriorityQueue(func, id);
        });

        it('should throw error on incorrect comparator parameter', function() {
            expect(() => {
                const pq = createPriorityQueue(1, id)
            }).to.throw();
        });
        
        it('should throw error on incorrect id parameter', function() {
            expect(() => {
                const node = createPriorityQueue(func, 1);
            }).to.throw();
        });
    });

    describe('# Enqueue and Dequeue', function() {
        const obj = {id: 0, val: 1};

        it('should insert a value into the priority queue', function() {
            const pq = createPriorityQueue(func, id);
            
            pq.enqueue(obj);
            expect(pq.dequeue()).to.deep.equal(obj);
        });

        it('should insert values in the queue using the comparator', function() {
            const pq = createPriorityQueue(func, id);
            const obj1 = {id: 0, val: 0}
            const obj2 = {id: 1, val: 1};
            const obj3 = {id: 2, val: 2};
            const obj4 = {id: 3, val: 7};

            pq.enqueue(obj1);
            pq.enqueue(obj3);
            pq.enqueue(obj2);
            pq.enqueue(obj4);

            expect(pq.dequeue()).to.deep.equal(obj1);
            expect(pq.dequeue()).to.deep.equal(obj2);
            expect(pq.dequeue()).to.deep.equal(obj3);
            expect(pq.dequeue()).to.deep.equal(obj4);
        });

        it('should return null when dequeued on empty queue', function() {
            const pq = createPriorityQueue(func, id);

            expect(pq.dequeue()).to.equal(null);
        })
    });

    describe('# Peek', function() {
        it('should return the value at the top', function() {
            const pq = createPriorityQueue(func, id);
            const obj = {id: 0, val: 1};

            pq.enqueue(obj);
            expect(pq.peek()).to.deep.equal(pq.dequeue());
        });
        it('should return the null for empty queue', function() {
            const pq = createPriorityQueue(func, id);
            expect(pq.peek()).to.equal(null);
        });
    });

    describe('# Update', function() {
        const obj = {id: 0, val: 1};

        it("should update the value of an item", function() {
            const pq = createPriorityQueue(func, id);
            const up_obj = {id: obj.id, val: 2};

            pq.enqueue(obj);
            pq.update(up_obj);
            expect(pq.dequeue()).to.equal(up_obj);
        });

        it("should update the value of correct item", function() {
            const pq = createPriorityQueue(func, id);
            const obj1 = {id: 0, val: 1};
            const obj2 = {id: 1, val: 2};
            const obj3 = {id: 2, val: 4};

            const up_obj = {id: obj2.id, val: 3};
            
            pq.enqueue(obj1);
            pq.enqueue(obj2);
            pq.enqueue(obj3);
            pq.update(up_obj);

            expect(pq.dequeue()).to.equal(obj1);
            expect(pq.dequeue()).to.equal(up_obj);
            expect(pq.dequeue()).to.equal(obj3);
        });

        it("should insert updated element in correct position", function() {
            const pq = createPriorityQueue(func, id);
            const obj1 = {id: 0, val: 1};
            const obj2 = {id: 1, val: 2};
            const obj3 = {id: 2, val: 4};

            const up_obj = {id: obj2.id, val: 10};
            
            pq.enqueue(obj1);
            pq.enqueue(obj2);
            pq.enqueue(obj3);
            pq.update(up_obj);

            expect(pq.dequeue()).to.equal(obj1);
            expect(pq.dequeue()).to.equal(obj3);
            expect(pq.dequeue()).to.equal(up_obj);
        });
    });

    describe('# Delete', function() {

        it('should delete value', function() {
            const pq = createPriorityQueue(func, id);
            const obj = {id: 0, val: 1};

            pq.enqueue(obj);
            pq.delete(obj.id);
            expect(pq.peek()).to.equal(null);
        });
        
        it('should delete value with given id and nothing else', function() {
            const pq = createPriorityQueue(func, id);
            const obj1 = {id: 0, val: 1};
            const obj2 = {id: 1, val: 2};

            pq.enqueue(obj1);
            pq.enqueue(obj2);
            pq.delete(obj1.id);
            expect(pq.peek()).to.deep.equal(obj2);
        });
    });
});