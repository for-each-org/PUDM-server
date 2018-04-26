class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }

    set next(node) {
        if(!node || node instanceof Node) {
            this._next = node;
            return;
        }
        
        throw "given node is not of type NODE";
    }

    get next() {
        return this._next;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }
};

module.exports = Node;