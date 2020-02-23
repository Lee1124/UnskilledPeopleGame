export default class NetClient extends Laya.Script{
	constructor(url){
		super();
		this.connectUrl = url;  //链接地址
		this.valid = false;
		this.connecting = false;
		this.socketOpen = false;
		this.socketMsgQueue = [];
		this.debug = false;
		this.intervalId = 0;
		this.RpcId = 100;
		this.RpcIdMap = new Map();

		console.log("【WebSocket】new NetClient() " + url);

		this.url = "ws://localhost:8989";
		//用于读取消息缓存数据
		this.byte = new Laya.Byte();
		//这里我们采用小端
		this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
		this.socket = new Laya.Socket();
		//这里我们采用小端
		this.socket.endian = Laya.Byte.LITTLE_ENDIAN;

		//建立连接
		this.socket.on(Laya.Event.OPEN, this, this.openHandler);
		this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
		this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
		this.socket.on(Laya.Event.ERROR, this, this.errorHandler);

		//socket开始连接事件
		this.onStartConnect=function(){console.log("【WebSocket】开始连接");}
		//链接成功事件,此处可用来初始化数据
		this.onConnectSucc=function(){ console.log("【WebSocket】链接成功");}
		//接收消息封装,请外部自己实现
		this.onMessage=function(data){
			console.log("【WebSocket】收到消息(请自己实现消息处理)："+data);
		};
	}

	//正确建立连接
	openHandler(event){
		this.connecting = false;
		this.socketOpen = true;
		console.log('【WebSocket】连接已打开！');
		this.onConnectSucc();
		
		for (var i = 0; i < this.socketMsgQueue.length; i++) {
			this.sendBinary(this.socketMsgQueue[i]);
		}
		this.socketMsgQueue = [];		
	}
 
	//关闭事件
	closeHandler(e){
		this.connecting = false;
		this.socketOpen = false;
		console.log('【WebSocket】已关闭！', e);
		this.socket.close();		
	}

	//连接出错
	errorHandler(e){
		this.connecting = false;
		this.socketOpen = false;
		console.log('【WebSocket】连接打开失败，请检查！' + e);
		this.socket.close();
	}
 
	Log(msg){
		if(this.debug)
			console.log(msg);
	}
	//重连
	reconnect(){
		console.log("【WebSocket】开始重连");
		this.open();
	}

	getSocket() {
		if(!this.socketOpen && !this.connecting&&this.valid) { 
			this.socket.close();
			this.onStartConnect();
			this.connecting = true;
			this.socketOpen = false;

			console.log("【WebSocket】开始连接 ",this.connectUrl);
			this.socket.connectByUrl(this.connectUrl);
	 
			return null;
		}

		return this.socketOpen ? this.socket : null;
	}
	open(){
		this.close();
		
		this.valid = true;
		this.getSocket();
		this.intervalId = setInterval(()=>{
			//心跳
			this.sendHeart();
		},5000);
	}
	//发送心跳消息
	sendHeart()
	{
		var _socket = this.getSocket();
		if(_socket!=null)
		{
			this.byte.clear();
			this.byte.writeInt32(0);
			this.socket.send(this.byte.buffer);
		}
	}
	close() {
		this.valid = false;
		this.socket.close();
		clearInterval(this.intervalId);	
		
		console.log("【WebSocket】关闭连接" + this.connectUrl);
	}
	
	stringSource(s) {
		var i = 0;
		return function () {
			return i < s.length ? s.charCodeAt(i++) : null;
		};
	}
	
	send(msg){
		if(!this.valid) {
			console.log("【WebSocket】请先调用 open() 开启网络");
			return;
		}
		
		if(this.debug)
			console.log("【WebSocket】发送消息 " , msg);
		
		if( msg.callback != null)
		{
			msg.data.RpcId = ++this.RpcId;
			this.RpcIdMap.set(msg.data.RpcId,msg.callback);
			// console.log("注册RPC回调 ["+msg.data.RpcId+"][" +msg.name +"]" +msg.callback);
		}	

		this.byte.clear();
		this.byte.pos = 4;
		//1. 写协议名字（自动写入2字节头长度）
		this.byte.writeUTFString(msg.name);
		//2. 写协议内容（自动写入2字节头长度）
		this.byte.writeUTFString(JSON.stringify(msg.data));

		//0. 写协议总长度
		var len = this.byte.pos;
		this.byte.pos = 0;
		this.byte.writeInt32(len);

		// 发送二进制消息
		this.sendBinary(this.byte.buffer);
		// 清空数据,下次使用
		this.byte.clear();
	}
 	
	//发送消息：协议名字,协议内容
	sendBinary(binaryMsg){
		var _socket = this.getSocket();
		if(_socket==null){
			this.socketMsgQueue.push(binaryMsg);
			return;
		}
		
		this.socket.send(binaryMsg);
	}

	receiveHandler(_msg){
		this.byte.clear();
		this.byte.writeArrayBuffer(_msg);
		this.byte.pos = 0;

		let msgLen = this.byte.getInt32();
		let protocolNameLen = this.byte.getUint8();
 
		var tmpByte = new Laya.Byte();
		tmpByte.endian = Laya.Byte.LITTLE_ENDIAN;
		let offset = 4;
		let name;
		let msg;

		//协议名字
		{
			this.byte.pos = 4;
			name = this.byte.readUTFString();
		}

		//协议内容
		{
			let json = this.byte.readUTFString();
			msg = JSON.parse(json);
		}

		if(this.debug)
			console.log("收到消息: " , msg);

		if(msg.RpcId > 100 && this.RpcIdMap.has(msg.RpcId))
		{
			let call = this.RpcIdMap.get(msg.RpcId);
			if(call!=null)
				call(name,msg);
			this.RpcIdMap.delete(msg.RpcId);
			
			return;
		}
		else
			this.onMessage(name,msg);
	}
}