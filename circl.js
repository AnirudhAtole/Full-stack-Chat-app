class circularQueue{
    constructor(size,queue=[],head=-1,tail=-1){
        this.size = size;
        if(queue){
        this.queue = queue;
        this.head = head;
        this.tail = tail;
        }
        else{
        this.queue = new Array(size)
        this.head = -1;
        this.tail = -1;
        }
        
    }

    enqueue(element){
        if((this.tail + 1) % this.size == this.head){
            return(false)
        }

        else if(this.head === -1){
            this.head = 0;
            this.tail = 0;
            this.queue[this.tail] = element;
        }
        else{
            this.tail = (this.tail + 1) % this.size;
            this.queue[this.tail] = element;
        }
        return(true)
    }

    dequeue(){
        if(this.head === -1){
            return(false);
        }

        else if(this.head === this.tail){
            this.temp = this.queue[this.head];
            this.head = -1;
            this.tail = -1;
            return true;
        }
        else{
            this.temp = this.queue[this.head];
            this.head = (this.head + 1) % this.size;
            return true;
        }
    }

    printCqueue(){
        if(this.head === -1){
            return(false)
        }

        else if(this.tail >= this.head){
            const arr = []
            for(let i= this.head ; i <= this.tail ; i++){
                arr.push(this.queue[i])
            }
            return(arr);
        }
        else{
            const arr = []
            for(let i = this.head ; i < this.size ; i++){
                arr.push(this.queue[i])
            }
            for(let i = 0 ; i <= this.tail ; i++){
                arr.push(this.queue[i])
            }
            return(arr);
        }
    }

    savequeue(){
        return ({queue:this.queue , head : this.head , tail : this.tail})
    }
}

const cque = new circularQueue(10);