package cn.edu.fudan.mybaits;

import java.util.LinkedList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;

/**
 * @author dash
 * @version 1.0 date 2015-7-20
 * @since JDK1.6
 */
public class Event implements EntityOperation{
	private int id;
	private String username;
	private int groupId;
	private String startDate;
	private String endDate;
	private String city;
	private String event;
	private String user_status;
	private String event_status;
	
	public Event() {
		super();
	}

	public Event(String username, int groupId, String startDate,
			String endDate, String city, String event, String user_status,
			String event_status) {
		super();
		this.username = username;
		this.groupId = groupId;
		this.startDate = startDate;
		this.endDate = endDate;
		this.city = city;
		this.event = event;
		this.user_status = user_status;
		this.event_status = event_status;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public int getGroupId() {
		return groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

	public String getUser_status() {
		return user_status;
	}

	public void setUser_status(String user_status) {
		this.user_status = user_status;
	}

	public String getEvent_status() {
		return event_status;
	}

	public void setEvent_status(String event_status) {
		this.event_status = event_status;
	}

	@Override
	public int save() {
		int flag = 0;
		try {
			SqlSession session = DAOManager.getSession();
			EventDAO eventDAO = session.getMapper(EventDAO.class);
			Event event = (Event) this;
			flag = eventDAO.insert(event);

			session.commit();
			session.close();
		} catch (Exception e) {
			flag = 0;
			System.out.println(e.toString());
		}
		return flag;
	}
	
	public static List<Event> getList(String groupId) {
		List<Event> list = new LinkedList<Event>();
		try {
			SqlSession session = DAOManager.getSession();
			EventDAO eventDAO = session.getMapper(EventDAO.class);
			System.out.println(groupId);
			list = eventDAO.getList(groupId);

			session.commit();
			session.close();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		return list;
	}
}
