
function Queue() {
	this.init = function() {
		this.size = 0;
		this.head = 0;
		this.tail = 0;
		this.maxSRN = -1;
		this.ackIndex = 0;
		this.list = new Array(); // 队列数据
	};

	// push
	this.push = function(data) {
		if (data == null)
			return;
		this.list.push(data);
		if(data.SRN != null && data.SRN > this.maxSRN)
			this.maxSRN = data.SRN;
//		console.log(this.name + " push " + JSON.stringify(data));
		this.head += 1;
	};

	// pop
	this.pop = function() {
		if (this.head <= this.tail)
			return null;
		var result = this.list[this.tail];
		this.tail += 1;
//		console.log(this.name + " pop " + JSON.stringify(result));
		return result;
	};

	// get size
	this.getSize = function() {
		return this.head - this.tail;
	};
	
	this.get = function(index) {
		if(index < tail)
			return this.list[index];
		return null;
	}
	
	this.back = function() {
		if(this.tail > 0)
			return this.list[this.tail-1];
		return null;
	}
	
	this.ack = function(message) {
		if(list[ackIndex].user != message.user || list[ackIndex].opcnt != message.opcnt) {
			alert("wrong ack!");
			return;
		}
		this.list[ackIndex].SRN = message.SRN;
		this.ackIndex += 1;
	}
	
	this.getSRN = function() {
		return this.maxSRN;
	}
}


