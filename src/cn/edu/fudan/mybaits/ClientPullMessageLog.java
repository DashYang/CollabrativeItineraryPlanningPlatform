package cn.edu.fudan.mybaits;

import java.sql.Timestamp;
import java.util.LinkedList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;

/**
 * @author dash
 * @version 1.0 date 2015-7-28
 * @since JDK1.6
 */
public class ClientPullMessageLog implements EntityOperation{
	private int id;
	private int timestamp;
	private String date;
	private String city;
	private String group;
	private String user;
	private String type;
	private String start;
	private String end;
	private String title;
	private String content;
	private int lastUpdateId;
	private Timestamp receiveTime;
	
	public ClientPullMessageLog() {
		super();
		this.id = 0;
		this.timestamp = 0;
		this.date = "";
		this.city = "";
		this.group = "";
		this.user = "";
		this.type = "";
		this.start = "";
		this.end = "";
		this.title = "";
		this.content = "";
		this.lastUpdateId = 0;
		this.receiveTime = null;
	}
	
	public ClientPullMessageLog(int timestamp ,String date, String city, String group,
			String user, String type, String start, String end, String title,
			String content , int lastUpdateId , Timestamp time) {
		super();
		this.id = 0;
		this.timestamp = timestamp;
		this.date = date;
		this.city = city;
		this.group = group;
		this.user = user;
		this.type = type;
		this.start = start;
		this.end = end;
		this.title = title;
		this.content = content;
		this.lastUpdateId = lastUpdateId;
		this.receiveTime = time;
	}

	public int getLastUpdateId() {
		return lastUpdateId;
	}

	public void setLastUpdateId(int lastUpdateId) {
		this.lastUpdateId = lastUpdateId;
	}

	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(int timestamp) {
		this.timestamp = timestamp;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getEnd() {
		return end;
	}

	public void setEnd(String end) {
		this.end = end;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Override
	public int save() {
		int saveId = -1;
		try {
			SqlSession session = DAOManager.getSession();
			ClientPullMessageLogDao messageLogDAO = session.getMapper(ClientPullMessageLogDao.class);
			ClientPullMessageLog messageLog = (ClientPullMessageLog) this;
			saveId = messageLogDAO.insert(messageLog);
			saveId = messageLog.getId();
			session.commit();
			session.close();
		} catch (Exception e) {
			saveId = 0;
			System.out.println(e.toString());
		}
		return saveId;
	}
	
	public static List<ClientPullMessageLog> getItineraryByMapInfo(String date , String city , String group,int lastUpdateId) {
		List<ClientPullMessageLog> list = new LinkedList<ClientPullMessageLog>();
		try {
			SqlSession session = DAOManager.getSession();
			ClientPullMessageLogDao messageLogDAO = session.getMapper(ClientPullMessageLogDao.class);
			list = messageLogDAO.getMessageByMapInfo(date, city, group,lastUpdateId);
			session.commit();
			session.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return list;
	}
}
