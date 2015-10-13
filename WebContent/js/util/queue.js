
function Queue() {
	this.init = function(name) {
		this.name = name;
		this.size = 0;
		this.head = 0;
		this.tail = 0;
		this.list = new Array(); // 队列数据
	};

	// push
	this.push = function(data) {
		if (data == null)
			return;
		this.list.push(data);
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
}

var localMessageLog = new Queue();
localMessageLog.init("local");
var remoteMessageLog = new Queue();
remoteMessageLog.init("remote");
