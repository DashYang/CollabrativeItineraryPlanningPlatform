package cn.edu.fudan.websocket;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.servlet.http.HttpSession;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import cn.edu.fudan.mybaits.EntityOperation;
import cn.edu.fudan.mybaits.MessageLog;

import net.sf.json.JSONObject;

/**
 * Servlet implementation class WebSocketServer
 */
@ServerEndpoint(value = "/WebSocketServer")
public class WebSocketServer {
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
		System.out.println("Message from " + session.getId() + ": " + message);
		JSONObject operateJSON = JSONObject.fromObject(message);
		int id = -100; // -100 error
		if (operateJSON.get("type").equals("connect")
				|| operateJSON.get("type").equals("close")) {

		} else {
			int timestamp = operateJSON.getInt("timestamp");
			String date = (String) operateJSON.get("date");
			String city = (String) operateJSON.get("city");
			String group = (String) operateJSON.get("group");
			String user = (String) operateJSON.get("user");
			String type = (String) operateJSON.get("type");
			int lastUpdateId = operateJSON.getInt("lastUpdateId");
			long receiveTime = (long) operateJSON.get("receiveTime");
			String identifer = (String) operateJSON.get("identifier");
			String targetUser = (String) operateJSON.get("targetUser");
			String start = operateJSON.get("start").toString();
			String end = (String) operateJSON.get("end");
			String title = (String) operateJSON.get("title");
			String content = (String) operateJSON.get("content");

			System.out.println(timestamp + " " + date + " " + city + " "
					+ group + " " + user + " " + type + " " + start + " " + end
					+ " " + title + " " + content + " " + lastUpdateId + " "
					+ receiveTime);
			MessageLog messageLog = new MessageLog(timestamp, date, city, group, user, type, start, end, title, content,
					lastUpdateId, receiveTime,identifer,targetUser);
			EntityOperation operation = messageLog;
			id = operation.save();
		}
		try {
			System.out.println("online User size:" + onlineUsers.size());
			for (Session otherUser : onlineUsers) {
				if (otherUser != session && otherUser.isOpen()) {
					System.out.println("send message to " + otherUser.getId());
					operateJSON.element("id", id);
					otherUser.getBasicRemote().sendText(operateJSON.toString());
				}
			}
			System.out.println("send message to (local) " + session.getId());
			operateJSON.element("id", id);
			operateJSON.element("type", "ack");
			session.getBasicRemote().sendText(operateJSON.toString());
		} catch (IOException ex) {
			ex.printStackTrace();
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
