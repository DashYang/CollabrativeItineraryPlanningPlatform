package cn.edu.fudan.websocket;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.servlet.http.HttpSession;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import cn.edu.fudan.mybaits.EntityOperation;
import cn.edu.fudan.mybaits.LockReplica;
import cn.edu.fudan.mybaits.MessageLog;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * Servlet implementation class WebSocketServer
 */
@ServerEndpoint(value = "/LockWebSocketServer")
public class LockWebSocketServer {
	private static final Set<Session> onlineUsers = new CopyOnWriteArraySet<Session>();
	private String nickname;
	private Session session;
	private HttpSession httpSession;

	/**
	 * @OnOpen allows us to intercept the creation of a new session. The session
	 *         class allows us to send data to the user. In the method onOpen,
	 *         we'll let the user know that the handshake was successful.
	 */
	@OnOpen
	public void onOpen(Session session) {
		System.out.println(session.getId() + " has opened a connection");
		try {
			onlineUsers.add(session);
			session.getBasicRemote().sendText("Connection Established");
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * When a user sends a message to the server, this method will intercept the
	 * message and allow us to react to it. For now the message is read as a
	 * String.
	 */
	@OnMessage
	public void onMessage(String message, Session session) {
		JSONObject operateJSON = JSONObject.fromObject(message);
		System.out.println(operateJSON.toString());
		String date = (String) operateJSON.get("date");
		String city = (String) operateJSON.get("city");
		String group = (String) operateJSON.get("group");
		if (operateJSON.get("type").equals("connect")
				|| operateJSON.get("type").equals("close")) {
			List list = LockReplica.getItineraryByMapInfo(date, city, group);
			JSONObject result = new JSONObject();
			result.put("list", list);
			try {
				session.getBasicRemote().sendText(result.toString());
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			String type = (String) operateJSON.get("type");
			String title = (String) operateJSON.get("title");
			String content = (String) operateJSON.get("content");
			String start = operateJSON.get("start").toString();
			String end = operateJSON.get("end").toString();
			Date nowDate = new Date();
			Timestamp receiveTime = new Timestamp(nowDate.getTime());
			if (type.equals("addPOI") || type.equals("addLine")) {
				LockReplica lockReplica = new LockReplica(date, city, group, start, end, type, title, content, receiveTime.toString());
				lockReplica.save();
			} else if(type.equals("deletePOI") || type.equals("deleteLine")) {
				LockReplica lockReplica = new LockReplica(date, city, group, start, end, type, title, content, receiveTime.toString());
				lockReplica.delete();
				if(type.equals("deletePOI")){
					List<LockReplica> list = LockReplica.getItineraryByMapInfo(date, city, group);
					String id = lockReplica.getContent();
					System.out.println(id);
					for(LockReplica item : list) {
						System.out.println(item.getStart() + " to " + item.getEnd());
						if(item.getType().equals("addLine") && ( item.getStart().equals(id)|| 
								item.getEnd().equals(id))) {
									int itemId = item.getId();
									item.setContent(String.valueOf(itemId));
									item.delete();
									System.out.println(item.getId());
								}
					}
				}
			} else{
				LockReplica lockReplica = new LockReplica(date, city, group, start, end, type, title, content, receiveTime.toString());
				lockReplica.update();
			}
			try {
				System.out.println("online User size:" + onlineUsers.size());
				List<LockReplica> list = LockReplica.getItineraryByMapInfo(date, city, group);
				JSONObject result = new JSONObject();
				result.put("list", list);
				for (Session otherUser : onlineUsers) {
					otherUser.getBasicRemote().sendText(result.toString());
				}
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

	/**
	 * The user closes the connection.
	 * 
	 * Note: you can't send messages to the client from this method
	 */
	@OnClose
	public void onClose(Session session) {
		onlineUsers.remove(session);
		System.out.println("Session " + session.getId() + " has ended");
	}

}
